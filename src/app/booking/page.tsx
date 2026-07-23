"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  ArrowRight, 
  Calendar, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  HeadphonesIcon, 
  User, 
  Mail, 
  MessageSquare,
  Car
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createBookingAction } from "@/app/actions/booking";
const OmCanvas = dynamic(() => import("@/components/history/OmCanvas"), { ssr: false });

// Zod validation schema (preserved backend rules exactly)
const bookingSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  travel_date: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0,0,0,0)), {
    message: "Travel date cannot be in the past",
  }),
  no_of_passengers: z.string().min(1, "Required"),
  vehicle_preference: z.string().optional().or(z.literal("")),
  pickup_location: z.string().min(2, "Pickup location is required"),
  drop_location: z.string().min(2, "Drop location is required"),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;



// Inline elegant animated route/map vector illustration simulating Lottie
function TravelAnimation() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full aspect-square max-w-[260px] mx-auto flex items-center justify-center pointer-events-none"
    >
      {/* Outer ambient auroras */}
      <div className="absolute w-44 h-44 bg-accent-primary/10 rounded-full blur-[50px] animate-pulse" />
      <div className="absolute w-36 h-36 bg-accent-secondary/10 rounded-full blur-[40px] delay-700 animate-pulse" />

      {/* Styled vector graphics */}
      <svg viewBox="0 0 200 200" className="w-full h-full text-accent-primary z-10 filter drop-shadow-[0_6px_12px_rgba(212,175,106,0.2)]">
        {/* Divine Aura rings */}
        <motion.circle 
          cx="100" cy="100" r="85" 
          fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle 
          cx="100" cy="100" r="70" 
          fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Dynamic Route Path drawing */}
        <motion.path
          d="M 40 140 C 60 80, 140 140, 160 60"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ strokeDasharray: "180", strokeDashoffset: "180" }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
        />

        {/* Start Point */}
        <circle cx="40" cy="140" r="6" fill="#D4AF6A" />
        <circle cx="40" cy="140" r="12" fill="none" stroke="#D4AF6A" strokeWidth="1" className="animate-ping" />

        {/* End Point / Temple Icon concept */}
        <g transform="translate(150, 48)">
          <path d="M10 0 L20 10 L0 10 Z" fill="#F5D08B" />
          <rect x="3" y="10" width="14" height="10" fill="#D4AF6A" />
          <line x1="10" y1="-5" x2="10" y2="0" stroke="#F5D08B" strokeWidth="1" />
          <polygon points="10,-5 15,-8 10,-10" fill="#F5D08B" />
        </g>

        {/* Floating golden particles */}
        <motion.circle cx="80" cy="100" r="2.5" fill="#FDEBD3" animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
        <motion.circle cx="120" cy="120" r="1.5" fill="#F5D08B" animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1.5 }} />
        <motion.circle cx="130" cy="80" r="2" fill="#D4AF6A" animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3.5, repeat: Infinity, delay: 2 }} />

        {/* Defs for gradients */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF6A" />
            <stop offset="100%" stopColor="#FDEBD3" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function BookingForm() {
  const searchParams = useSearchParams();
  const vehicleParam = searchParams.get("vehicle");
  const packageParam = searchParams.get("package");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: contact } = await supabase.from("contact_info").select("*").limit(1).single();
      if (contact) setContactInfo(contact);

      const { data: fleet } = await supabase.from("fleet").select("*").eq("show_on_website", true).order("display_order", { ascending: true });
      if (fleet) setVehicles(fleet);
    }
    fetchData();
  }, []);

  const phoneSupport = contactInfo?.phone_numbers?.[0] || "+91 98765 43210";

  // Map incoming URL params safely to option names
  const getInitialVehicle = () => {
    if (!vehicleParam) return "";
    const lower = vehicleParam.toLowerCase();
    if (lower.includes("ertiga")) return "Ertiga";
    if (lower.includes("innova")) return "Innova Crysta";
    if (lower.includes("traveller")) return "Force Traveller";
    if (lower.includes("bus")) return "Bus Booking";
    // Fallbacks for original select options
    if (lower === "sedan") return "Ertiga";
    if (lower === "suv") return "Innova Crysta";
    if (lower === "tempo traveller") return "Force Traveller";
    return "";
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      vehicle_preference: getInitialVehicle(),
      message: packageParam ? `I am interested in the ${packageParam} package.` : "",
      no_of_passengers: "",
      travel_date: "",
      full_name: "",
      phone: "",
      email: "",
      pickup_location: "",
      drop_location: "",
    }
  });

  useEffect(() => {
    async function fetchProfile() {
      if (status === "authenticated" && session?.user?.email) {
        const { data } = await supabase.from("users").select("*").eq("email", session.user.email).single();
        if (data) {
          setUserProfile(data);
          const currentValues = getValues();
          if (!currentValues.full_name && data.name) setValue("full_name", data.name, { shouldValidate: true });
          if (!currentValues.email && data.email) setValue("email", data.email, { shouldValidate: true });
          if (!currentValues.phone && data.phone) setValue("phone", data.phone, { shouldValidate: true });
        }
      }
    }
    fetchProfile();
  }, [status, session, setValue, getValues]);

  // Watch fields to render dynamic summary card
  const watchedFields = watch();

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      if (status === "authenticated" && session?.user?.email) {
        if (!userProfile?.phone || userProfile.phone !== data.phone) {
          await supabase.from("users").update({ phone: data.phone }).eq("email", session.user.email);
        }
      }

      const result = await createBookingAction({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        travel_date: data.travel_date,
        no_of_passengers: data.no_of_passengers,
        vehicle_preference: data.vehicle_preference,
        pickup_location: data.pickup_location,
        drop_location: data.drop_location,
        message: data.message || null,
        user_id: (session?.user as any)?.id || null,
        user_email: session?.user?.email || data.email || null,
        package_name: packageParam || "",
      });

      if (!result.success) throw new Error(result.error);
      
      toast.success("Booking request submitted! We will confirm your yatra shortly.");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trustBadges = [
    { name: "Verified Drivers", icon: ShieldCheck },
    { name: "Secure Booking", icon: Wrench },
    { name: "VIP Darshan Assistance", icon: CheckCircle2 },
    { name: "24/7 Customer Support", icon: HeadphonesIcon },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      
      {/* Left Column - Compact Multi-section Form inside a single parent card */}
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl overflow-hidden space-y-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Section 1: Personal Information */}
          <div className="relative z-10">
            <h3 className="text-base font-display font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent-primary rounded-full animate-pulse" />
              1. Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="full_name" className="text-black/70 dark:text-white/70 text-xs font-medium">Full Name *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><User size={16} /></span>
                  <input 
                    id="full_name" 
                    type="text" 
                    placeholder="Enter your name" 
                    {...register("full_name")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.full_name && <p className="text-red-400 text-[11px] mt-0.5">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-black/70 dark:text-white/70 text-xs font-medium">Phone Number *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><Phone size={16} /></span>
                  <input 
                    id="phone" 
                    type="text" 
                    placeholder="+91 XXXXX XXXXX" 
                    {...register("phone")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-[11px] mt-0.5">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label htmlFor="email" className="text-black/70 dark:text-white/70 text-xs font-medium">Email Address (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><Mail size={16} /></span>
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    {...register("email")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-[11px] mt-0.5">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Section 2: Travel Details */}
          <div className="relative z-10">
            <h3 className="text-base font-display font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent-primary rounded-full animate-pulse" />
              2. Travel Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="travel_date" className="text-black/70 dark:text-white/70 text-xs font-medium">Travel Date *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><Calendar size={16} /></span>
                  <input 
                    id="travel_date" 
                    type="date" 
                    {...register("travel_date")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm [color-scheme:dark]"
                  />
                </div>
                {errors.travel_date && <p className="text-red-400 text-[11px] mt-0.5">{errors.travel_date.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="no_of_passengers" className="text-black/70 dark:text-white/70 text-xs font-medium">Number of Passengers *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><Users size={16} /></span>
                  <input 
                    id="no_of_passengers" 
                    type="number" 
                    min="1" 
                    placeholder="e.g. 4" 
                    {...register("no_of_passengers")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.no_of_passengers && <p className="text-red-400 text-[11px] mt-0.5">{errors.no_of_passengers.message}</p>}
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Section 3: Premium Vehicle Selection Cards (Compact Horizontal Layout) */}
          <div className="relative z-10">
            <h3 className="text-base font-display font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent-primary rounded-full animate-pulse" />
              3. Select Vehicle (Optional)
            </h3>

            <input type="hidden" {...register("vehicle_preference")} />

            <div className="grid md:grid-cols-2 gap-3">
              {vehicles.map((opt) => {
                const isSelected = watchedFields.vehicle_preference === opt.name;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (isSelected) {
                        setValue("vehicle_preference", "", { shouldValidate: true });
                      } else {
                        setValue("vehicle_preference", opt.name, { shouldValidate: true });
                      }
                    }}
                    className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 relative ${
                      isSelected 
                        ? "border-accent-primary bg-accent-primary/10 shadow-[0_0_15px_rgba(212,175,106,0.15)] scale-[1.01]" 
                        : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    {/* Compact Horizontal Layout */}
                    <div className="p-3 flex items-center gap-3 z-10 relative">
                      {opt.cover_image && (
                        <Image
                          src={opt.cover_image}
                          alt={opt.name}
                          width={64}
                          height={48}
                          className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-black dark:text-white text-xs truncate">{opt.name}</span>
                          <span className="text-[10px] text-accent-primary font-semibold whitespace-nowrap ml-1">
                            {opt.min_passengers && opt.max_passengers ? `${opt.min_passengers}-${opt.max_passengers} Seater` : opt.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-black/50 dark:text-white/50 truncate mt-0.5 leading-none">{opt.short_description || opt.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                        isSelected ? "border-accent-primary bg-accent-primary" : "border-white/20"
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-ink" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.vehicle_preference && <p className="text-red-400 text-xs mt-2">{errors.vehicle_preference.message}</p>}
          </div>

          <hr className="border-white/10" />

          {/* Section 4: Journey Details */}
          <div className="relative z-10">
            <h3 className="text-base font-display font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent-primary rounded-full animate-pulse" />
              4. Journey Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label htmlFor="pickup_location" className="text-black/70 dark:text-white/70 text-xs font-medium">Pickup Location *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><MapPin size={16} /></span>
                  <input 
                    id="pickup_location" 
                    type="text" 
                    placeholder="e.g. Indore Airport" 
                    {...register("pickup_location")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.pickup_location && <p className="text-red-400 text-[11px] mt-0.5">{errors.pickup_location.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="drop_location" className="text-black/70 dark:text-white/70 text-xs font-medium">Drop Location *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"><MapPin size={16} /></span>
                  <input 
                    id="drop_location" 
                    type="text" 
                    placeholder="e.g. Omkareshwar" 
                    {...register("drop_location")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.drop_location && <p className="text-red-400 text-[11px] mt-0.5">{errors.drop_location.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-black/70 dark:text-white/70 text-xs font-medium">Special Requirements (Optional)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-black/40 dark:text-white/40"><MessageSquare size={16} /></span>
                <textarea 
                  id="message" 
                  rows={2}
                  placeholder="Specific instructions, additional stops, or route preferences..." 
                  {...register("message")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </form>

      {/* Right Column - Sticky Booking Summary & Trust Badges */}
      <div className="lg:col-span-1 space-y-6 sticky top-28">
        
        {/* Travel Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white/5 backdrop-blur-xl border border-[#D4AF6A]/30 rounded-[2rem] p-6 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <h3 className="text-base font-display font-bold text-black dark:text-white mb-6 pb-4 border-b border-white/10 tracking-wide flex items-center gap-2">
            <Car className="text-accent-primary" size={20} />
            Yatra Summary
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="text-black/60 dark:text-white/60 text-sm">Vehicle:</span>
              <span className="text-black dark:text-white font-semibold text-right text-sm">
                {watchedFields.vehicle_preference || <span className="text-accent-primary/60 italic font-light">Not selected</span>}
              </span>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <span className="text-black/60 dark:text-white/60 text-sm">Travel Date:</span>
              <span className="text-black dark:text-white font-semibold text-sm">
                {watchedFields.travel_date ? new Date(watchedFields.travel_date).toLocaleDateString(undefined, { dateStyle: "medium" }) : <span className="text-black/40 dark:text-white/40 font-light">--/--/----</span>}
              </span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-black/60 dark:text-white/60 text-sm">Passengers:</span>
              <span className="text-black dark:text-white font-semibold text-sm">
                {watchedFields.no_of_passengers || <span className="text-black/40 dark:text-white/40 font-light">--</span>}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="text-black/60 dark:text-white/60 text-sm">Pickup:</span>
              <span className="text-black dark:text-white font-semibold text-right text-sm max-w-[150px] truncate">
                {watchedFields.pickup_location || <span className="text-black/40 dark:text-white/40 font-light">--</span>}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="text-black/60 dark:text-white/60 text-sm">Destination:</span>
              <span className="text-black dark:text-white font-semibold text-right text-sm max-w-[150px] truncate">
                {watchedFields.drop_location || <span className="text-black/40 dark:text-white/40 font-light">--</span>}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="group relative flex items-center justify-center gap-3 px-8 py-4.5 bg-gradient-to-r from-[#D4AF6A] to-[#F5D08B] hover:from-[#F5D08B] hover:to-[#D4AF6A] text-ink font-bold rounded-full overflow-hidden w-full shadow-[0_0_30px_rgba(212,175,106,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,106,0.5)] disabled:opacity-50 disabled:scale-100"
            >
              <span className="relative z-10 tracking-wide uppercase text-sm">
                {isSubmitting ? "Submitting..." : "Confirm Yatra Request"}
              </span>
              {!isSubmitting && <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary flex-shrink-0">
                  <Icon size={16} />
                </div>
                <span className="text-black/80 dark:text-white/80 font-medium text-xs leading-tight">{badge.name}</span>
              </div>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="text-center p-4.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-black/60 dark:text-white/60 text-xs">Need help planning your customized tour?</p>
          <a 
            href={`tel:${phoneSupport.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 mt-2 text-accent-primary font-bold hover:text-black dark:text-white transition-colors text-sm"
          >
            <Phone size={14} />
            {phoneSupport}
          </a>
        </div>

      </div>

    </div>
  );
}

export default function BookingPage() {
  const phoneSupport = "+91 98765 43210";

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-28 pb-16 bg-transparent relative z-10 overflow-hidden">
        
        {/* Soft Golden Background glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-[150px] -z-10 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[150px] -z-10 mix-blend-multiply" />
        
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Compact Hero Section */}
          <div className="grid lg:grid-cols-12 gap-8 items-center mb-8">
            
            {/* Left Hero side */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8 max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 text-[#F5D08B] text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-2 animate-pulse" />
                Devoted Premium Travel
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-black dark:text-white leading-[1.1] mb-3">
                Book Your Sacred Journey
              </h1>
              
              <p className="text-sm md:text-base text-black/80 dark:text-white/80 leading-relaxed mb-5">
                Reserve your pilgrimage with comfort, safety, and premium hospitality. 
                Let us handle the journey while you focus entirely on your devotion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/packages"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D4AF6A] to-[#F5D08B] text-ink font-bold rounded-full shadow-lg hover:shadow-xl text-sm transition-all hover:-translate-y-0.5"
                >
                  View Packages
                </Link>
                <a 
                  href={`tel:${phoneSupport.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-black dark:text-white font-bold rounded-full text-sm transition-all hover:bg-white/20 hover:scale-[1.02]"
                >
                  Contact Support
                </a>
              </div>
            </motion.div>

            {/* Right Hero side - 3D rotating OM model on its axis */}
            <div className="lg:col-span-4 flex justify-center items-center h-[260px]">
              <div className="w-full max-w-[260px] h-full aspect-square rounded-full overflow-hidden shadow-[0_0_50px_-15px_rgba(212,175,55,0.3)] border-2 border-accent-primary/20 bg-gradient-to-b from-[#D4AF6A]/10 to-transparent">
                <OmCanvas />
              </div>
            </div>

          </div>

          {/* Form and Summary Container */}
          <Suspense fallback={<div className="text-center py-20 text-black/50 dark:text-white/50">Loading form...</div>}>
            <BookingForm />
          </Suspense>

        </div>
      </main>
      <Footer />
    </>
  );
}
