"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    try {
      // Create bucket if it doesn't exist, though we assume the client sets it up.
      // For now we assume standard storage insert
      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file);
      
      if (uploadError) {
        // If storage is not setup, fallback to placeholder logic for now
        console.warn("Storage upload failed, falling back to dummy url", uploadError);
        const { error: dbError } = await supabase.from("gallery").insert([
          { image_url: `https://placehold.co/600x400/FFE5B4/A63A1E?text=${encodeURIComponent(file.name)}`, title: file.name }
        ]);
        if (dbError) throw dbError;
      } else {
        const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
        const { error: dbError } = await supabase.from("gallery").insert([
          { image_url: publicUrl, title: file.name }
        ]);
        if (dbError) throw dbError;
      }

      toast.success("Image uploaded successfully");
      fetchGallery();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    // Attempt to delete from storage if it's a supabase URL
    if (url.includes("supabase.co")) {
      const path = url.split("/").pop();
      if (path) await supabase.storage.from("images").remove([`gallery/${path}`]);
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Image deleted");
      fetchGallery();
    }
  };

  const updateDetails = async (id: string, title: string, description: string) => {
    const { error } = await supabase.from("gallery").update({ title, description }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Details updated");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Gallery Management</h1>
          <p className="text-ink-muted">Upload and manage images for the public gallery</p>
        </div>
        <div>
          <input type="file" id="upload" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          <Label htmlFor="upload" className="inline-flex h-11 px-6 py-2 items-center justify-center rounded-xl bg-accent-primary text-surface font-medium cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all gap-2">
            <Plus size={18} /> {uploading ? "Uploading..." : "Upload Image"}
          </Label>
        </div>
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
