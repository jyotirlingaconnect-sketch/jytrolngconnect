"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const bookingSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  travel_date: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0,0,0,0)), {
    message: "Travel date cannot be in the past",
  }),
  no_of_passengers: z.string().min(1, "Required"),
  vehicle_preference: z.string().min(1, "Please select a vehicle"),
  pickup_location: z.string().min(2, "Pickup location is required"),
  drop_location: z.string().min(2, "Drop location is required"),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookingForm() {
  const searchParams = useSearchParams();
  const vehicleParam = searchParams.get("vehicle");
  const packageParam = searchParams.get("package"); // Can be used later if package ID is passed

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      vehicle_preference: vehicleParam || "",
      message: packageParam ? `I am interested in the ${packageParam} package.` : "",
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert([
        {
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || null,
          travel_date: data.travel_date,
          no_of_passengers: parseInt(data.no_of_passengers, 10),
          vehicle_preference: data.vehicle_preference,
          pickup_location: data.pickup_location,
          drop_location: data.drop_location,
          message: data.message || null,
          status: "pending",
        },
      ]);

      if (error) throw error;
      
      toast.success("Booking request submitted! We will confirm your yatra shortly.");
      reset();
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" placeholder="Enter your name" {...register("full_name")} />
              {errors.full_name && <p className="text-error text-sm">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" placeholder="+91 XXXXX XXXXX" {...register("phone")} />
              {errors.phone && <p className="text-error text-sm">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Optional" {...register("email")} />
              {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_of_passengers">No. of Passengers *</Label>
              <Input id="no_of_passengers" type="number" min="1" {...register("no_of_passengers")} />
              {errors.no_of_passengers && <p className="text-error text-sm">{errors.no_of_passengers.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="travel_date">Travel Date *</Label>
              <Input id="travel_date" type="date" {...register("travel_date")} />
              {errors.travel_date && <p className="text-error text-sm">{errors.travel_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_preference">Vehicle Preference *</Label>
              <select 
                id="vehicle_preference" 
                {...register("vehicle_preference")}
                className="flex h-11 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <option value="">Select a vehicle</option>
                <option value="Sedan">Sedan (4 Seater)</option>
                <option value="SUV">SUV (6-7 Seater)</option>
                <option value="Tempo Traveller">Tempo Traveller (12-17 Seater)</option>
                <option value="Mini Bus">Mini Bus (20-25 Seater)</option>
                <option value="Luxury Bus">Luxury Bus (35-45 Seater)</option>
              </select>
              {errors.vehicle_preference && <p className="text-error text-sm">{errors.vehicle_preference.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pickup_location">Pickup Location *</Label>
              <Input id="pickup_location" placeholder="e.g. Indore Airport" {...register("pickup_location")} />
              {errors.pickup_location && <p className="text-error text-sm">{errors.pickup_location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="drop_location">Drop Location *</Label>
              <Input id="drop_location" placeholder="e.g. Omkareshwar" {...register("drop_location")} />
              {errors.drop_location && <p className="text-error text-sm">{errors.drop_location.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Special Requirements (Optional)</Label>
            <Textarea 
              id="message" 
              placeholder="Any specific instructions, timing requests, or additional stops..." 
              className="min-h-[100px]"
              {...register("message")}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Booking Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Book Your Yatra
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              Fill out the details below to request a booking. Our team will verify availability and confirm your journey.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-10">Loading form...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
