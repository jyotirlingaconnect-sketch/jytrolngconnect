"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LottieAnimation from "@/components/LottieAnimation";
import { Button } from "@/components/ui/button";
import { 
  Users, Briefcase, Snowflake, CheckCircle2, Navigation, 
  ShieldCheck, Wrench, HeadphonesIcon, Map
} from "lucide-react";

export const whyChooseUs = [
  { title: "Verified Drivers", desc: "Expert, background-checked professionals.", icon: ShieldCheck },
  { title: "Regular Maintenance", desc: "Vehicles serviced before every long trip.", icon: Wrench },
  { title: "Clean & Sanitized", desc: "Spotless interiors for a pure journey.", icon: CheckCircle2 },
  { title: "24×7 Roadside Support", desc: "We are always here if you need us.", icon: HeadphonesIcon },
  { title: "Comfortable Travel", desc: "Pushback seats and ample legroom.", icon: Users },
  { title: "GPS Enabled", desc: "Real-time tracking for ultimate safety.", icon: Map },
];

export function FleetClient() {
  const [fleets, setFleets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFleets() {
      const { data, error } = await supabase
        .from("fleet")
        .select("*")
        .eq("show_on_website", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
        
      if (!error && data) {
        setFleets(data);
      }
      setLoading(false);
    }
    fetchFleets();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden pt-24 pb-20">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-accent-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 mb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6">
              <CheckCircle2 className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-semibold text-accent-primary uppercase tracking-wider">Premium Pilgrimage Fleet</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-ink mb-6 leading-tight">
              Travel in Comfort, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                Safety & Luxury
              </span>
            </h1>
            <p className="text-lg md:text-xl text-ink-muted leading-relaxed mb-10 max-w-xl">
              Every vehicle in our fleet is professionally maintained, strictly sanitized, and driven by experienced pilots to ensure your spiritual journey is peaceful and secure.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-accent-primary text-surface" asChild>
                <Link href="/contact">Book Your Vehicle</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg hover:-translate-y-1 transition-all" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2 relative flex justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Decorative Glow Behind Lottie */}
              <div className="absolute inset-0 bg-accent-primary/10 rounded-full blur-[100px]" />
              <LottieAnimation 
                path="https://lottie.host/17ad5de8-eb49-43df-ac57-a3648419dbd7/bYvO8yI4P0.json" 
                className="w-full h-full relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="container mx-auto px-4 md:px-6 mb-24 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
          </div>
        ) : fleets.length === 0 ? (
          <div className="text-center py-20 text-ink-muted bg-surface rounded-3xl border border-border">
            <p className="text-xl font-medium">No vehicles are currently available.</p>
            <p className="mt-2">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12 lg:gap-16">
            {fleets.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group relative flex flex-col lg:flex-row items-stretch gap-0 bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:bg-surface/60 transition-all duration-500 overflow-hidden"
              >
                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                
                {/* Image Side */}
                <div className="w-full lg:w-5/12 relative aspect-video lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-bg">
                  {vehicle.cover_image ? (
                    <Image 
                      src={vehicle.cover_image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-muted/50">
                      No Image Available
                    </div>
                  )}
                  {vehicle.cover_image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  )}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-lg">
                      <Users size={16} />
                      <span className="font-semibold text-sm tracking-wide">{vehicle.min_passengers}-{vehicle.max_passengers} Guests</span>
                    </div>
                    {vehicle.is_featured && (
                      <div className="inline-flex items-center gap-2 bg-accent-primary/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-lg">
                        <span className="font-semibold text-sm tracking-wide">Featured</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-7/12 p-6 lg:p-8 flex flex-col justify-center relative z-20">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-ink group-hover:text-accent-primary transition-colors duration-300">
                      {vehicle.name}
                    </h2>
                    {vehicle.starting_price && (
                      <div className="text-right">
                        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Starting at</p>
                        <p className="text-xl font-bold text-accent-secondary">₹{vehicle.starting_price}</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-ink-muted text-base leading-relaxed mb-4">
                    {vehicle.short_description || vehicle.description || "No description provided."}
                  </p>

                  {/* Feature Chips */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {vehicle.features.slice(0, 6).map((feat: string, i: number) => (
                        <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border/80 shadow-sm text-sm font-medium text-ink">
                          <CheckCircle2 size={14} className="text-accent-secondary" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8 p-4 md:p-5 rounded-2xl bg-surface/50 border border-border/50">
                    <div className="flex items-start gap-3">
                      <Snowflake className="w-5 h-5 text-accent-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold mb-1">Category</p>
                        <p className="font-medium text-ink">{vehicle.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-accent-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold mb-1">Brand</p>
                        <p className="font-medium text-ink">{vehicle.brand}</p>
                      </div>
                    </div>
                    {vehicle.perfect_for && vehicle.perfect_for.length > 0 && (
                      <div className="flex items-start gap-3 col-span-2">
                        <Navigation className="w-5 h-5 text-accent-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold mb-1">Perfect For</p>
                          <p className="font-medium text-ink">{vehicle.perfect_for.join(", ")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-auto">
                    <Button className="h-11 px-6 rounded-xl flex-1 md:flex-none shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all bg-ink hover:bg-ink/90 text-surface" asChild>
                      <Link href={`/contact?subject=Booking ${encodeURIComponent(vehicle.name)}`}>
                        Book This Vehicle
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-11 px-6 rounded-xl flex-1 md:flex-none hover:-translate-y-0.5 transition-all bg-surface hover:bg-surface/80" asChild>
                      <Link href={`/contact?subject=Quote for ${encodeURIComponent(vehicle.name)}`}>
                        Get Quote
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Compare Vehicles Table */}
      {!loading && fleets.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 mb-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-ink mb-4">Compare Our Fleet</h2>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">Find the perfect vehicle size and comfort level for your pilgrimage group.</p>
            </div>
            
            <div className="overflow-x-auto rounded-3xl border border-border/50 shadow-xl bg-surface/50 backdrop-blur-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ink/5 border-b border-border/50">
                    <th className="p-6 font-display font-bold text-ink">Vehicle</th>
                    <th className="p-6 font-display font-bold text-ink">Guests</th>
                    <th className="p-6 font-display font-bold text-ink">Category</th>
                    <th className="p-6 font-display font-bold text-ink">Features</th>
                    <th className="p-6 font-display font-bold text-ink">Perfect For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {fleets.map((row, i) => (
                    <tr key={i} className="hover:bg-surface/80 transition-colors">
                      <td className="p-6 font-semibold text-ink">{row.name}</td>
                      <td className="p-6 text-ink-muted flex items-center gap-2"><Users size={16}/> {row.min_passengers}-{row.max_passengers}</td>
                      <td className="p-6 text-ink-muted">{row.category}</td>
                      <td className="p-6 text-ink-muted">
                        <div className="flex gap-1 flex-wrap">
                          {row.features?.slice(0, 2).map((f: string) => (
                            <span key={f} className="text-xs bg-bg border border-border px-2 py-0.5 rounded">{f}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 text-ink-muted">
                        {row.perfect_for?.[0] || "All"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      )}

      {/* Why Choose Our Fleet */}
      <section className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-ink mb-4">Why Choose Our Fleet</h2>
          <p className="text-lg text-ink-muted">We go above and beyond to ensure your journey is safe, comfortable, and memorable.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whyChooseUs.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-surface/50 backdrop-blur-xl border border-border/50 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-accent-primary/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-primary transition-all duration-300">
                <feature.icon className="w-7 h-7 text-accent-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
              <p className="text-ink-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
