"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { upload } from "@vercel/blob/client";
import { 
  Save, 
  X, 
  UploadCloud, 
  Trash2, 
  Image as ImageIcon,
  Check,
  Star,
  Users,
  Settings,
  Car
} from "lucide-react";

// Schema for validation
const fleetSchema = z.object({
  name: z.string().min(2, "Fleet name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  min_passengers: z.number().min(1),
  max_passengers: z.number().min(1),
  perfect_for: z.array(z.string()),
  tags: z.array(z.string()),
  features: z.array(z.string()),
  starting_price: z.number().optional().nullable(),
  price_per_km: z.number().optional().nullable(),
  price_per_day: z.number().optional().nullable(),
  driver_charges: z.number().optional().nullable(),
  display_order: z.number(),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  is_popular: z.boolean(),
  show_on_website: z.boolean(),
});

type FleetFormData = z.infer<typeof fleetSchema>;

interface FleetFormProps {
  initialData?: any; // the database row
}

const CATEGORIES = ["Sedan", "SUV", "Traveller", "Bus", "Luxury Bus"];
const BRANDS = ["Maruti Suzuki", "Toyota", "Force", "Tata", "Ashok Leyland", "Hyundai", "Mahindra"];
const PERFECT_FOR_OPTIONS = [
  "Couples", "Family", "Friends", "Corporate Groups", 
  "Pilgrimage Groups", "Senior Citizens", "VIP Guests", 
  "Large Groups", "School Trips", "Religious Tours"
];
const TAG_OPTIONS = [
  "Luxury", "Most Affordable", "Premium", "Popular", 
  "Best Seller", "Family Friendly", "Recommended", 
  "New", "AC Vehicle", "Spacious"
];
const FEATURE_OPTIONS = [
  "Air Conditioned", "Pushback Seats", "Recliner Seats", 
  "Music System", "Charging Ports", "GPS", "Luggage Space", 
  "Professional Driver", "Sanitized Daily", "Drinking Water", 
  "First Aid Kit", "Comfortable Suspension"
];

export function FleetForm({ initialData }: FleetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Image states
  const [coverImage, setCoverImage] = useState<string>(initialData?.cover_image || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.gallery_images || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FleetFormData>({
    resolver: zodResolver(fleetSchema),
    defaultValues: {
      name: initialData?.name || "",
      brand: initialData?.brand || "",
      category: initialData?.category || "",
      short_description: initialData?.short_description || "",
      description: initialData?.description || "",
      min_passengers: initialData?.min_passengers || 1,
      max_passengers: initialData?.max_passengers || 4,
      perfect_for: initialData?.perfect_for || [],
      tags: initialData?.tags || [],
      features: initialData?.features || [],
      starting_price: initialData?.starting_price || null,
      price_per_km: initialData?.price_per_km || null,
      price_per_day: initialData?.price_per_day || null,
      driver_charges: initialData?.driver_charges || null,
      display_order: initialData?.display_order || 0,
      is_available: initialData?.is_available ?? true,
      is_featured: initialData?.is_featured ?? false,
      is_popular: initialData?.is_popular ?? false,
      show_on_website: initialData?.show_on_website ?? true,
    },
  });

  const { watch, handleSubmit, control, formState: { errors } } = form;
  const formData = watch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    setErrorMsg("");

    try {
      const files = Array.from(e.target.files);
      const newUrls: string[] = [];

      for (const file of files) {
        // We use @vercel/blob/client for client-side uploads. 
        // We assume /api/upload route exists and allows admin uploads.
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        newUrls.push(blob.url);
      }

      if (!coverImage && newUrls.length > 0) {
        setCoverImage(newUrls[0]);
        if (newUrls.length > 1) {
          setGalleryImages([...galleryImages, ...newUrls.slice(1)]);
        }
      } else {
        setGalleryImages([...galleryImages, ...newUrls]);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg("Error uploading images. Make sure you are authenticated.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (url: string) => {
    setGalleryImages(galleryImages.filter(img => img !== url));
  };

  const makeCoverImage = (url: string) => {
    setGalleryImages([...galleryImages.filter(img => img !== url), coverImage].filter(Boolean));
    setCoverImage(url);
  };

  const onSubmit = async (data: FleetFormData) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        ...data,
        cover_image: coverImage,
        gallery_images: galleryImages,
      };

      if (initialData?.id) {
        const { error } = await supabase.from("fleet").update(payload).eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fleet").insert([payload]);
        if (error) throw error;
      }

      router.push("/admin/fleet");
      router.refresh();
    } catch (err: any) {
      console.error("Submit error:", err);
      setErrorMsg(err.message || "An error occurred while saving the fleet.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Form Section */}
      <div className="w-full lg:w-2/3 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <Car size={18} className="text-accent-primary" /> Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Fleet Name *</label>
                <input {...form.register("name")} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" placeholder="e.g. Innova Crysta" />
                {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Brand *</label>
                <select {...form.register("brand")} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none">
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.brand && <p className="text-error text-xs mt-1">{errors.brand.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Vehicle Category *</label>
                <select {...form.register("category")} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none">
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-error text-xs mt-1">{errors.category.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Short Description</label>
                <input {...form.register("short_description")} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" placeholder="One-line summary..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Detailed Description</label>
              <textarea {...form.register("description")} rows={4} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" placeholder="Describe comfort, interior, journey experience..." />
            </div>
          </div>

          {/* Section 2: Passenger Details */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <Users size={18} className="text-accent-primary" /> Passenger Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Min Passengers</label>
                <input type="number" {...form.register("min_passengers", { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Max Passengers</label>
                <input type="number" {...form.register("max_passengers", { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              </div>
            </div>
            <p className="text-xs text-ink-muted">Will display as: {formData.min_passengers}–{formData.max_passengers} Guests</p>
          </div>

          {/* Options: Perfect For, Tags, Features */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-display font-semibold text-ink flex items-center gap-2">
              <Settings size={18} className="text-accent-primary" /> Classification & Features
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Perfect For</label>
              <div className="flex flex-wrap gap-2">
                <Controller
                  name="perfect_for"
                  control={control}
                  render={({ field }) => (
                    <>
                      {PERFECT_FOR_OPTIONS.map(opt => {
                        const isSelected = field.value.includes(opt);
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => {
                              const newValue = isSelected 
                                ? field.value.filter(v => v !== opt)
                                : [...field.value, opt];
                              field.onChange(newValue);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                              isSelected ? "bg-accent-primary text-surface border-accent-primary" : "bg-bg text-ink-muted border-border hover:border-accent-primary/50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <>
                      {TAG_OPTIONS.map(opt => {
                        const isSelected = field.value.includes(opt);
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => {
                              const newValue = isSelected 
                                ? field.value.filter(v => v !== opt)
                                : [...field.value, opt];
                              field.onChange(newValue);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                              isSelected ? "bg-accent-secondary text-surface border-accent-secondary" : "bg-bg text-ink-muted border-border hover:border-accent-secondary/50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Controller
                  name="features"
                  control={control}
                  render={({ field }) => (
                    <>
                      {FEATURE_OPTIONS.map(opt => {
                        const isSelected = field.value.includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer hover:text-ink transition-colors">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...field.value, opt]
                                  : field.value.filter(v => v !== opt);
                                field.onChange(newValue);
                              }}
                              className="w-4 h-4 rounded border-border text-accent-primary focus:ring-accent-primary"
                            />
                            {opt}
                          </label>
                        );
                      })}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-accent-primary" /> Fleet Images
            </h2>
            
            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-bg hover:bg-bg/80 hover:border-accent-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*"
                onChange={handleFileUpload}
              />
              <UploadCloud className="mx-auto text-ink-muted mb-2" size={32} />
              <p className="text-sm font-medium text-ink">Click or drag images to upload</p>
              <p className="text-xs text-ink-muted mt-1">Supports JPG, PNG, WEBP (Max 5MB per file)</p>
              {isUploading && <p className="text-accent-primary text-sm mt-2 font-medium">Uploading...</p>}
            </div>

            {coverImage && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium text-ink">Cover Image</h3>
                <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden border border-accent-primary shadow-sm">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-accent-primary text-surface text-xs font-bold px-2 py-1 rounded shadow">COVER</div>
                  <button 
                    type="button"
                    onClick={() => {
                      setCoverImage("");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-error text-white rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}

            {galleryImages.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium text-ink">Gallery Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => makeCoverImage(url)}
                          className="p-1.5 bg-surface text-ink rounded hover:text-accent-primary transition-colors"
                          title="Make Cover"
                        >
                          <Star size={16} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="p-1.5 bg-surface text-error rounded hover:bg-error hover:text-white transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-display font-semibold text-ink mb-4">Pricing (Optional)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Starting Price (₹)</label>
                <input type="number" {...form.register("starting_price", { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Price Per KM (₹)</label>
                <input type="number" {...form.register("price_per_km", { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Price Per Day (₹)</label>
                <input type="number" {...form.register("price_per_day", { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Driver Charges (₹)</label>
                <input type="number" {...form.register("driver_charges", { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-display font-semibold text-ink mb-4">Visibility & Availability</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...form.register("is_available")} className="w-4 h-4 rounded border-border text-accent-primary focus:ring-accent-primary" />
                <div>
                  <div className="text-sm font-medium text-ink">Available</div>
                  <div className="text-xs text-ink-muted">Vehicle is currently available for booking.</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...form.register("is_featured")} className="w-4 h-4 rounded border-border text-accent-primary focus:ring-accent-primary" />
                <div>
                  <div className="text-sm font-medium text-ink">Featured Fleet</div>
                  <div className="text-xs text-ink-muted">Show this vehicle prominently on the website.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...form.register("show_on_website")} className="w-4 h-4 rounded border-border text-accent-primary focus:ring-accent-primary" />
                <div>
                  <div className="text-sm font-medium text-ink">Show on Website</div>
                  <div className="text-xs text-ink-muted">Make this vehicle visible to public users.</div>
                </div>
              </label>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm font-medium text-ink mb-1">Display Order</label>
              <input type="number" {...form.register("display_order", { valueAsNumber: true })} className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-border bg-bg text-sm focus:border-accent-primary focus:outline-none" />
              <p className="text-xs text-ink-muted mt-1">Lower numbers appear first.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={() => router.push("/admin/fleet")}
              className="px-6 py-2 rounded-lg font-medium text-ink hover:bg-bg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg font-medium bg-accent-primary text-surface hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : <><Save size={18} /> Save Fleet</>}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className="w-full lg:w-1/3">
        <div className="sticky top-24 space-y-4">
          <h3 className="font-display font-semibold text-ink">Live Preview</h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-[4/3] bg-bg overflow-hidden">
              {coverImage ? (
                <img src={coverImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted/50">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span>No Cover Image</span>
                </div>
              )}
              {formData.is_featured && (
                <div className="absolute top-4 left-4 bg-accent-primary text-surface text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  FEATURED
                </div>
              )}
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-display font-bold text-xl text-ink leading-tight">
                    {formData.name || "Fleet Name"}
                  </h4>
                  <p className="text-sm text-ink-muted">{formData.brand || "Brand"}</p>
                </div>
                {formData.starting_price && (
                  <div className="text-right">
                    <p className="text-xs text-ink-muted">Starting from</p>
                    <p className="font-bold text-accent-secondary">₹{formData.starting_price}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center justify-center px-2.5 py-1 bg-bg border border-border rounded text-xs font-medium text-ink">
                  {formData.category || "Category"}
                </span>
                <span className="inline-flex items-center justify-center px-2.5 py-1 bg-bg border border-border rounded text-xs font-medium text-ink">
                  <Users size={12} className="mr-1 text-accent-primary" />
                  {formData.min_passengers}-{formData.max_passengers} Guests
                </span>
              </div>
              
              <p className="text-sm text-ink-muted line-clamp-2 mb-4">
                {formData.short_description || formData.description || "Description will appear here..."}
              </p>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {formData.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
                      {tag}
                    </span>
                  ))}
                  {formData.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-bg text-ink-muted border border-border">
                      +{formData.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-2">
                {formData.features?.slice(0, 4).map(feature => (
                  <div key={feature} className="flex items-center text-xs text-ink-muted">
                    <Check size={12} className="mr-1.5 text-success shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
