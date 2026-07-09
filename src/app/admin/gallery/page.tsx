"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadArea } from "@/components/ImageUploadArea";
import { deleteImageFromBlob } from "@/lib/blob";

interface GalleryImage {
  id: string;
  created_at: string;
  image_url: string;
  title?: string;
  description?: string;
  sort_order?: number;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("gallery").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (error) toast.error("Failed to load gallery");
    else setImages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUploadComplete = async (url: string) => {
    if (!url) return;
    const fileName = url.split("/").pop()?.split("-")[0] || "Gallery Image";
    try {
      const { error: dbError } = await supabase.from("gallery").insert([
        { image_url: url, title: fileName }
      ]);
      if (dbError) throw dbError;
      fetchGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save image in database");
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    const toastId = toast.loading("Deleting image...");
    try {
      // Attempt Vercel Blob deletion
      await deleteImageFromBlob(url);

      // Delete from Supabase
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Image deleted", { id: toastId });
      fetchGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete image", { id: toastId });
    }
  };

  const updateDetails = async (id: string, title: string, description: string) => {
    const { error } = await supabase.from("gallery").update({ title, description }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Details updated");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink mb-2">Gallery Management</h1>
        <p className="text-ink-muted">Upload and manage images for the public gallery</p>
      </div>

      {/* Drag & Drop Bulk Uploader */}
      <div className="mb-10">
        <ImageUploadArea
          folder="gallery"
          multiple
          value={[]}
          onChange={(urls) => {
            // Since multiple is true, ImageUploadArea returns an array.
            // In our custom flow, we fetch the last uploaded item
            const lastUrl = urls[urls.length - 1];
            if (lastUrl) handleUploadComplete(lastUrl);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-8 text-center text-ink-muted">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="col-span-full py-8 text-center text-ink-muted bg-surface rounded-xl border border-border border-dashed">
            No images in gallery. Upload one to get started.
          </div>
        ) : (
          images.map((img) => (
            <Card key={img.id} className="overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-surface border-b border-border relative group">
                <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="ghost" className="text-error bg-bg/90 hover:bg-bg hover:text-error" onClick={() => handleDelete(img.id, img.image_url)}>
                    <Trash2 size={18} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 flex-grow flex flex-col space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-ink-muted">Title</Label>
                  <Input 
                    defaultValue={img.title || ""} 
                    onBlur={(e) => updateDetails(img.id, e.target.value, img.description || "")}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-ink-muted">Description</Label>
                  <Input 
                    defaultValue={img.description || ""} 
                    onBlur={(e) => updateDetails(img.id, img.title || "", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
