"use client";

import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Car, Map, User } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  city?: string;
  overall_rating: number;
  experience: string;
  profile_image_url?: string;
  package_name?: string;
  fleet_name?: string;
}

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    // Only fetch approved testimonials that we have consent to publish
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, city, overall_rating, experience, profile_image_url, package_name, fleet_name')
      .eq('status', 'approved')
      .eq('consent_to_publish', true)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (loading) return null; // Or a skeleton loader
  
  if (testimonials.length === 0) return null; // Hide section if no testimonials

  return (
    <section className="py-12 md:py-20 bg-section-bg transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 md:mb-12 gap-4">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-bold text-ink mb-3"
            >
              Words from Pilgrims
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-ink-muted"
            >
              Don&apos;t just take our word for it. Here is what our esteemed guests have to say about their journey.
            </motion.p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="min-w-[44px] min-h-[44px] w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-ink hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollNext}
              className="min-w-[44px] min-h-[44px] w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-ink hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="embla overflow-hidden" 
          ref={emblaRef}
        >
          <div className="embla__container flex">
            {testimonials.map((testimonial) => (
              <div className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_40%] pl-4" key={testimonial.id}>
                <div className="h-full p-5 md:p-8 rounded-3xl bg-surface/50 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-shadow relative group flex flex-col">
                  <Quote className="absolute top-8 right-8 text-accent-secondary/20 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                  
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.overall_rating || 5 }).map((_, i) => (
                      <span key={i} className="text-accent-secondary text-xl">★</span>
                    ))}
                  </div>

                  <p className="text-ink-muted leading-relaxed mb-6 italic relative z-10 text-lg flex-1">
                    &ldquo;{testimonial.experience}&rdquo;
                  </p>
                  
                  <div className="flex flex-col gap-2 mb-6 border-t border-border/50 pt-4">
                    {testimonial.package_name && (
                      <div className="flex items-center gap-2 text-sm text-ink-muted">
                        <Map size={14} className="text-accent-primary" /> {testimonial.package_name}
                      </div>
                    )}
                    {testimonial.fleet_name && (
                      <div className="flex items-center gap-2 text-sm text-ink-muted">
                        <Car size={14} className="text-accent-primary" /> {testimonial.fleet_name}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-auto bg-surface/80 p-3 rounded-2xl border border-border/50">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent-secondary/30 bg-bg flex items-center justify-center shrink-0">
                      {testimonial.profile_image_url ? (
                        <Image 
                          src={testimonial.profile_image_url} 
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="text-ink-muted w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-ink truncate">{testimonial.name}</h4>
                      {testimonial.city && (
                        <p className="text-sm text-ink-muted truncate">{testimonial.city}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div className="flex justify-center mt-10 gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                selectedIndex === idx ? "bg-accent-primary scale-125" : "bg-border hover:bg-accent-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
