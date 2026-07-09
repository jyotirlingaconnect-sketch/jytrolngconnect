"use client";

import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 5,
    text: "The journey from Ujjain to Omkareshwar was incredibly smooth. The driver was polite, punctual, and knew the routes perfectly. Highly recommended for family trips.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "Premium experience! The Innova was spotless, AC worked perfectly, and the ride was completely bump-free. They truly understand the needs of pilgrims.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Amit Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "Booked them for my parents' anniversary trip. The team ensured their absolute comfort. Safe driving, great hospitality, and complete peace of mind.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
  }
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  return (
    <section className="py-24 bg-section-bg transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-ink mb-4"
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
              className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-ink hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-ink hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-colors"
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
                <div className="h-full p-8 rounded-3xl bg-surface/50 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-shadow relative group">
                  <Quote className="absolute top-8 right-8 text-accent-secondary/20 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                  
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-accent-secondary text-xl">★</span>
                    ))}
                  </div>

                  <p className="text-ink-muted leading-relaxed mb-8 italic relative z-10 text-lg">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent-secondary/30">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink">{testimonial.name}</h4>
                      <p className="text-sm text-ink-muted">{testimonial.location}</p>
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
