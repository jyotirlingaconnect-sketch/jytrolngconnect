"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, ChevronDown, CheckCircle2, Shield, HeartHandshake, Map, Star, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/LottieAnimation";

const contactSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(3, "Subject is required"),
  travel_date: z.string().min(1, "Travel date is required"),
  passengers: z.string().min(1, "Number of travellers is required"),
  message: z.string().min(10, "Please provide a detailed message"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactInfo {
  phone_numbers?: string[];
  email?: string;
  address?: string;
  business_hours?: string;
}

interface ContactClientProps {
  contactInfo: ContactInfo | null;
}

const faqs = [
  {
    question: "How do I book a pilgrimage package?",
    answer: "You can book directly through our website by selecting a package, or you can contact our 24/7 support team via phone or WhatsApp to customize your journey."
  },
  {
    question: "How can I get VIP Darshan assistance?",
    answer: "We arrange VIP Darshan tickets for Mahakaleshwar and Omkareshwar as part of our premium packages. Please mention this requirement when booking."
  },
  {
    question: "Can I customize my travel package?",
    answer: "Absolutely! We specialize in tailor-made itineraries. Let us know your preferences, group size, and dates, and we will craft the perfect sacred journey for you."
  },
  {
    question: "What vehicles are available for the journey?",
    answer: "We offer a premium fleet including luxury sedans, comfortable SUVs (Innova Crysta), and spacious tempo travellers for larger families and groups."
  }
];

const trustFeatures = [
  { title: "VIP Darshan Assistance", desc: "Seamless temple entry", icon: Star },
  { title: "24×7 Support", desc: "Always here for you", icon: Clock },
  { title: "Custom Tour Planning", desc: "Tailored to your needs", icon: Map },
  { title: "Family Packages", desc: "Comfort for all ages", icon: HeartHandshake },
  { title: "Verified Drivers", desc: "Safe and experienced", icon: Shield },
  { title: "Transparent Pricing", desc: "No hidden charges", icon: CheckCircle2 },
];

function AccordionItem({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-border/50 rounded-2xl overflow-hidden bg-surface/30 backdrop-blur-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-display font-semibold text-ink text-lg">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="text-accent-primary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-ink-muted leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactClient({ contactInfo }: ContactClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert([{
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        message: `Subject: ${data.subject}\nDate: ${data.travel_date}\nPassengers: ${data.passengers}\n\n${data.message}`,
        status: "pending",
      }]);
      if (error) throw error;
      toast.success("Enquiry sent successfully! We will contact you soon.");
      reset();
    } catch {
      toast.error("Failed to send enquiry. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = contactInfo?.phone_numbers?.[0] || "+91 98765 43210";
  const cleanPhone = phone.replace(/\s+/g, '');
  const email = contactInfo?.email || "info@jyotirlingconnect.com";
  const address = contactInfo?.address || "Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456006";
  const businessHours = contactInfo?.business_hours || "Monday - Sunday\n9:00 AM - 8:00 PM";
  
  const addressLines = address.split(",");
  const mainAddress = addressLines[0] || "";
  const subAddress = addressLines.slice(1).join(",").trim() || "";
  const hoursLines = businessHours.split("\n");
  const mainDays = hoursLines[0] || "";
  const subHours = hoursLines.slice(1).join(" ").trim() || "";

  return (
    <>
      <Navbar />
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bg">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-secondary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <main className="flex min-h-[100dvh] flex-col pt-24 md:pt-28 pb-12 md:pb-20 overflow-hidden">
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 max-w-7xl mb-10 md:mb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border/50 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                <span className="text-sm font-medium text-ink-muted tracking-wide uppercase">Premium Support</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink leading-[1.1]">
                Get in Touch <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                  With Us
                </span>
              </h1>
              <p className="text-xl text-ink-muted leading-relaxed max-w-xl">
                We&apos;re always here to help you plan a peaceful, comfortable, and memorable pilgrimage. Experience divine hospitality.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href={`tel:${cleanPhone}`}>
                  <Button size="lg" className="rounded-full px-8 h-14 bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 transition-opacity text-white shadow-xl shadow-accent-primary/20">
                    <Phone className="mr-2" size={20} />
                    Call Now
                  </Button>
                </a>
                <a href="#booking-form">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 border-border/50 bg-surface/30 backdrop-blur-md hover:bg-surface/50">
                    Book Your Journey
                  </Button>
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative h-[250px] md:h-[400px] lg:h-[450px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/5 to-accent-secondary/5 rounded-full blur-3xl" />
              <LottieAnimation path="/lottie/customer-support.json" className="w-full h-full max-w-[500px]" />
            </motion.div>
          </div>
        </section>

        {/* Quick Contact Cards */}
        <section className="container mx-auto px-4 md:px-6 max-w-7xl mb-10 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Call Us", value: phone, link: `tel:${cleanPhone}`, icon: Phone, lottie: "phone.json" },
              { title: "WhatsApp", value: phone, link: `https://wa.me/${cleanPhone}`, icon: MessageCircle, lottie: "whatsapp.json" },
              { title: "Email Us", value: email, link: `mailto:${email}`, icon: Mail, lottie: "email.json" },
            ].map((item, i) => (
              <motion.a 
                href={item.link}
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-3xl bg-surface/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-ink mb-1">{item.title}</h3>
                    <p className="text-ink-muted font-medium">{item.value}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Form and Details Split */}
        <section className="container mx-auto px-4 md:px-6 max-w-7xl mb-10 md:mb-20" id="booking-form">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Contact Details (Left on desktop) */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">Office & Info</h2>
                <p className="text-ink-muted leading-relaxed">
                  Visit our office near the sacred Mahakaleshwar Temple, or reach out to us through any of the channels below.
                </p>
              </motion.div>

              {[
                { icon: MapPin, title: "Head Office", lines: [mainAddress, subAddress] },
                { icon: Clock, title: "Business Hours", lines: [mainDays, subHours] },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-3xl bg-surface/30 backdrop-blur-md border border-border/50"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-ink mb-2">{item.title}</h3>
                    {item.lines.map((line, idx) => (
                      <p key={idx} className="text-ink-muted">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-8 rounded-3xl overflow-hidden border border-border/50 shadow-lg h-[250px] relative bg-surface/50"
              >
                {/* Fallback map if iframe fails or is loading */}
                <div className="absolute inset-0 flex items-center justify-center text-ink-muted flex-col gap-2">
                  <MapPin size={32} className="text-accent-primary/50" />
                  <span>Loading Map...</span>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.4338903565983!2d75.7656!3d23.1827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82abdf7899d412!2sMahakaleshwar%20Jyotirlinga!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative z-10 opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </motion.div>
            </div>

            {/* Luxury Form (Right on desktop) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-surface/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_20px_60px_rgb(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgb(0,0,0,0.2)]">
                <h2 className="text-3xl font-display font-bold text-ink mb-8">Send an Enquiry</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-ink font-medium ml-1">Full Name *</Label>
                      <Input 
                        placeholder="John Doe" 
                        className="h-12 md:h-14 bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-2xl transition-all"
                        {...register("full_name")} 
                      />
                      {errors.full_name && <p className="text-error text-sm ml-1">{errors.full_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-ink font-medium ml-1">Phone Number *</Label>
                      <Input 
                        placeholder="+91 XXXXX XXXXX" 
                        className="h-12 md:h-14 bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-2xl transition-all"
                        {...register("phone")} 
                      />
                      {errors.phone && <p className="text-error text-sm ml-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-ink font-medium ml-1">Email Address *</Label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="h-12 md:h-14 bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-2xl transition-all"
                        {...register("email")} 
                      />
                      {errors.email && <p className="text-error text-sm ml-1">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-ink font-medium ml-1">Travel Date *</Label>
                      <Input 
                        type="date" 
                        className="h-12 md:h-14 bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-2xl transition-all"
                        {...register("travel_date")} 
                      />
                      {errors.travel_date && <p className="text-error text-sm ml-1">{errors.travel_date.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-ink font-medium ml-1">Subject *</Label>
                      <Input 
                        placeholder="Package Enquiry" 
                        className="h-12 md:h-14 bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-2xl transition-all"
                        {...register("subject")} 
                      />
                      {errors.subject && <p className="text-error text-sm ml-1">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-ink font-medium ml-1">Number of Travellers *</Label>
                      <Input 
                        type="number" 
                        placeholder="2" 
                        min="1"
                        className="h-12 md:h-14 bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-2xl transition-all"
                        {...register("passengers")} 
                      />
                      {errors.passengers && <p className="text-error text-sm ml-1">{errors.passengers.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-ink font-medium ml-1">Your Message *</Label>
                    <Textarea 
                      placeholder="Tell us about your specific requirements, preferred vehicles, or VIP Darshan needs..." 
                      className="min-h-[100px] resize-none bg-white/50 dark:bg-black/20 border-border/50 focus:border-accent-primary/50 focus:ring-accent-primary/20 rounded-xl transition-all p-3"
                      {...register("message")}
                    />
                    {errors.message && <p className="text-error text-xs ml-1">{errors.message.message}</p>}
                  </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 md:h-14 text-lg font-medium rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 transition-opacity text-white shadow-xl shadow-accent-primary/20 overflow-hidden relative group" 
                      disabled={isSubmitting}
                    >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10">{isSubmitting ? "Sending Request..." : "Send Request"}</span>
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Contact Us Grid */}
        <section className="container mx-auto px-4 md:px-6 max-w-7xl mb-10 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ink mb-6">Our Promise</h2>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto">
              We go beyond transportation. We deliver a complete spiritual experience with premium hospitality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-surface/30 backdrop-blur-md border border-border/50 hover:bg-surface/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-6 group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-white transition-all duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-display font-bold text-ink mb-2">{feature.title}</h3>
                <p className="text-ink-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="container mx-auto px-4 md:px-6 max-w-4xl mb-10 md:mb-20">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ink mb-6">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] p-8 md:p-14 text-center bg-gradient-to-br from-accent-primary/10 via-surface to-accent-secondary/10 border border-white/20 dark:border-white/5"
          >
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-ink leading-tight">
                Ready for Your Sacred Journey?
              </h2>
              <p className="text-lg text-ink-muted">
                Our team is just one call away from helping you plan a peaceful pilgrimage to the Jyotirlingas.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href={`tel:${cleanPhone}`}>
                  <Button size="lg" className="rounded-full px-8 h-14 bg-[#2B1710] hover:bg-[#2B1710]/90 text-white shadow-xl">
                    <Phone className="mr-2" size={20} />
                    Call Us Now
                  </Button>
                </a>
                <a href={`https://wa.me/${cleanPhone}`}>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 border-[#2B1710] text-[#2B1710] hover:bg-[#2B1710]/5 bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                    <MessageCircle className="mr-2" size={20} />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  );
}
