"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { upload } from "@vercel/blob/client";
import { supabase } from "@/lib/supabase";
import { 
  Camera, UploadCloud, Star, Heart, CheckCircle2, Info, 
  Car, Map, Calendar, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const testimonialSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  package_name: z.string().optional(),
  fleet_name: z.string().optional(),
  travel_date: z.string().optional(),
  overall_rating: z.number().min(1, "Please provide an overall rating"),
  driver_rating: z.number().optional(),
  vehicle_rating: z.number().optional(),
  support_rating: z.number().optional(),
  darshan_rating: z.number().optional(),
  experience: z.string().min(10, "Please share a bit more about your experience").max(2000, "Maximum 2000 characters allowed"),
  recommendation: z.enum(["Yes", "Maybe", "No"]),
  consent_to_publish: z.boolean().refine(val => val === true, { message: "You must give permission to publish" }),
});

type TestimonialForm = z.infer<typeof testimonialSchema>;

const PACKAGES = [
  "Mahakaleshwar VIP Darshan",
  "Omkareshwar Tour",
  "Ujjain Local Sightseeing",
  "Maheshwar Tour",
  "Mandu Tour",
  "Ujjain & Omkareshwar 2 Days",
  "Other"
];

const FLEETS = [
  "Ertiga",
  "Innova Crysta",
  "Force Traveller",
  "Bus",
  "Other"
];

export default function TestimonialSubmissionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const form = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "", email: "", phone: "", city: "",
      package_name: "", fleet_name: "", travel_date: "",
      overall_rating: 0, driver_rating: 0, vehicle_rating: 0, support_rating: 0, darshan_rating: 0,
      experience: "", recommendation: "Yes",
    }
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = form;
  const experienceText = watch("experience") || "";

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const StarRating = ({ name, label, required = false }: { name: any, label: string, required?: boolean }) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-border/50 bg-bg/50">
            <span className="text-sm font-medium text-ink">{label} {required && <span className="text-error">*</span>}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.onChange(star)}
                  className={`p-1 hover:scale-110 transition-transform ${field.value >= star ? "text-accent-secondary" : "text-border"}`}
                >
                  <Star size={24} fill={field.value >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
        )}
      />
    );
  };

  const onSubmit = async (data: TestimonialForm) => {
    setIsSubmitting(true);
    try {
      let profile_image_url = "";
      if (profileImage) {
        const blob = await upload(profileImage.name, profileImage, {
          access: 'public',
          handleUploadUrl: '/api/upload/public',
        });
        profile_image_url = blob.url;
      }

      const gallery_images: string[] = [];
      for (const file of galleryFiles) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload/public',
        });
        gallery_images.push(blob.url);
      }

      const payload = {
        ...data,
        profile_image_url,
        gallery_images,
        status: 'pending'
      };

      // Since we map `name` to `name` in the schema and DB, it aligns.
      // Make sure we include location mapping if needed, but DB now has `city`.
      const { error } = await supabase.from('testimonials').insert([
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          city: payload.city,
          location: payload.city, // fallback for legacy
          package_name: payload.package_name,
          fleet_name: payload.fleet_name,
          travel_date: payload.travel_date || null,
          overall_rating: payload.overall_rating,
          rating: payload.overall_rating, // fallback for legacy
          driver_rating: payload.driver_rating,
          vehicle_rating: payload.vehicle_rating,
          support_rating: payload.support_rating,
          darshan_rating: payload.darshan_rating,
          experience: payload.experience,
          message: payload.experience, // fallback for legacy
          recommendation: payload.recommendation,
          consent_to_publish: payload.consent_to_publish,
          status: payload.status,
          profile_image_url: payload.profile_image_url,
          image_url: payload.profile_image_url, // fallback for legacy
          gallery_images: payload.gallery_images
        }
      ]);

      if (error) throw error;
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-surface max-w-lg w-full rounded-3xl p-8 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border"
        >
          <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-4">Thank You! 🙏</h1>
          <p className="text-ink-muted mb-8">
            Your testimonial has been received successfully. We appreciate you taking the time to share your spiritual journey. Our team will review it before publishing it to inspire thousands of pilgrims.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-6 py-3 rounded-full border border-border text-ink hover:bg-bg transition-colors font-medium">
              Back to Home
            </Link>
            <Link href="/booking" className="px-6 py-3 rounded-full bg-accent-primary text-white hover:bg-accent-secondary transition-colors font-medium">
              Book Another Journey
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-surface border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-secondary/10 text-accent-secondary text-sm font-medium mb-6 border border-accent-secondary/20">
            <Heart size={16} /> Share Your Experience
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink mb-6">
            Share Your Spiritual Journey
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Your feedback inspires thousands of pilgrims. Tell us about your experience with Jyotirling Connect and help others embark on their divine journey.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. Personal Information */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-display font-bold text-ink mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ink mb-1.5">Full Name <span className="text-error">*</span></label>
                  <input {...register("name")} className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all" placeholder="Your full name" />
                  {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                </div>

              </div>
            </div>

            {/* 2. Profile Picture */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-display font-bold text-ink mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">2</span>
                Profile Picture
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-border bg-bg overflow-hidden flex items-center justify-center shrink-0 relative group">
                  {profilePreview ? (
                    <>
                      <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" />
                      </div>
                    </>
                  ) : (
                    <Camera className="text-ink-muted w-8 h-8" />
                  )}
                  <input type="file" accept="image/*" onChange={handleProfileImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div>
                  <h3 className="font-medium text-ink mb-1">Upload a photo of yourself</h3>
                  <p className="text-sm text-ink-muted mb-4">Adding a photo helps other pilgrims connect with your story. Max 5MB.</p>
                  <label className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-bg border border-border text-sm font-medium text-ink hover:border-accent-primary transition-colors cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
                    {profilePreview ? "Change Photo" : "Browse Files"}
                  </label>
                </div>
              </div>
            </div>
            {/* 3. Service Rating */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-display font-bold text-ink mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">3</span>
                Rate Your Experience
              </h2>
              <div className="space-y-3">
                <StarRating name="overall_rating" label="Overall Experience" required />
                {errors.overall_rating && <p className="text-error text-xs">{errors.overall_rating.message}</p>}
                <StarRating name="driver_rating" label="Driver Behaviour & Professionalism" />
                <StarRating name="vehicle_rating" label="Vehicle Cleanliness & Comfort" />
                <StarRating name="darshan_rating" label="VIP Darshan Assistance" />
                <StarRating name="support_rating" label="Customer Support" />
              </div>
            </div>

            {/* 4. Experience */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-display font-bold text-ink mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">4</span>
                Your Story
              </h2>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Tell us about your spiritual journey with Jyotirling Connect <span className="text-error">*</span></label>
                <textarea 
                  {...register("experience")} 
                  rows={6}
                  placeholder="Describe your darshan experience, the comfort of the vehicle, the hospitality of our team, and any memorable moments..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all resize-y"
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.experience ? (
                    <p className="text-error text-xs">{errors.experience.message}</p>
                  ) : (
                    <p className="text-ink-muted text-xs flex items-center gap-1"><Info size={12} /> Helps others plan their pilgrimage</p>
                  )}
                  <span className={`text-xs ${experienceText.length > 2000 ? "text-error" : "text-ink-muted"}`}>
                    {experienceText.length}/2000
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Journey Photos */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-display font-bold text-ink mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">5</span>
                Journey Photos (Optional)
              </h2>
              <p className="text-sm text-ink-muted mb-6 pl-10">Upload temple photos, group photos, or memorable moments.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-bg border border-border overflow-hidden relative group">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error">
                      &times;
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-bg hover:bg-bg/80 hover:border-accent-primary/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-ink-muted hover:text-accent-primary">
                  <UploadCloud size={24} />
                  <span className="text-xs font-medium">Add Photos</span>
                  <input type="file" multiple accept="image/*" onChange={handleGalleryImages} className="hidden" />
                </label>
              </div>
            </div>

            {/* 6. Final Steps */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border space-y-8">
              <div>
                <label className="block text-sm font-medium text-ink mb-3">Would you recommend Jyotirling Connect to your friends and family?</label>
                <div className="flex gap-4">
                  {["Yes", "Maybe", "No"].map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" value={option} {...register("recommendation")} className="w-4 h-4 text-accent-primary focus:ring-accent-primary border-border" />
                      <span className="text-sm text-ink group-hover:text-accent-primary transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" {...register("consent_to_publish")} className="mt-1 w-5 h-5 rounded border-border text-accent-primary focus:ring-accent-primary" />
                  <div>
                    <span className="text-sm font-medium text-ink group-hover:text-accent-primary transition-colors block mb-1">
                      I give permission to publish <span className="text-error">*</span>
                    </span>
                    <span className="text-xs text-ink-muted">
                      I consent to Jyotirling Connect publishing my testimonial, name, and uploaded photos on their website and social media platforms for marketing purposes.
                    </span>
                  </div>
                </label>
                {errors.consent_to_publish && <p className="text-error text-xs mt-2 ml-8">{errors.consent_to_publish.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-accent-primary text-white font-bold text-lg hover:bg-accent-secondary transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_10px_30px_-10px_rgba(212,175,55,0.5)]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit My Experience <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}
