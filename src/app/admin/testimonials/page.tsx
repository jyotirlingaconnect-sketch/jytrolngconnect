"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  location?: string;
  rating: number;
  message: string;
  is_approved: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load testimonials");
    else setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("testimonials").update({ is_approved: !currentStatus }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(currentStatus ? "Testimonial hidden" : "Testimonial approved");
      fetchTestimonials();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Testimonial deleted");
      fetchTestimonials();
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("testimonials").insert([
      {
        name: formData.get("name"),
        location: formData.get("location"),
        rating: parseInt(formData.get("rating") as string),
        message: formData.get("message"),
        is_approved: true, // auto approve since admin added it
      }
    ]);

    if (error) toast.error(error.message);
    else {
      toast.success("Testimonial added");
      (e.target as HTMLFormElement).reset();
      fetchTestimonials();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Testimonials</h1>
          <p className="text-ink-muted">Manage pilgrim reviews and testimonials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-ink-muted">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="py-8 text-center text-ink-muted bg-surface rounded-xl border border-border border-dashed">
              No testimonials found.
            </div>
          ) : (
            testimonials.map((test) => (
              <Card key={test.id} className={test.is_approved ? "border-success/50" : "border-border"}>
                <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink">{test.name}</h3>
                      <span className="text-xs text-ink-muted bg-surface border border-border px-2 py-0.5 rounded-full">{test.location}</span>
                      <div className="text-accent-secondary text-sm">{"★".repeat(test.rating)}</div>
                    </div>
                    <p className="text-ink-muted italic">&ldquo;{test.message}&rdquo;</p>
                    <div className="text-xs text-ink-muted">
                      {new Date(test.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
                    <Button 
                      variant={test.is_approved ? "outline" : "primary"} 
                      size="sm" 
                      onClick={() => toggleApproval(test.id, test.is_approved)}
                      className={test.is_approved ? "text-error border-error hover:bg-error hover:text-white" : "bg-success text-white hover:bg-success/90"}
                    >
                      {test.is_approved ? <XCircle size={16} className="mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                      {test.is_approved ? "Hide" : "Approve"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(test.id)} className="text-error hover:bg-error/10">
                      <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-ink mb-4">Add Testimonial Manually</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pilgrim Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="e.g. Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <select id="rating" name="rating" className="flex h-11 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink ring-offset-surface">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Average</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" required className="min-h-[100px]" />
                </div>
                <Button type="submit" className="w-full">Add Testimonial</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
