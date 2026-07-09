"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Snowflake, Briefcase } from "lucide-react";

import { vehicles } from "@/lib/fleet-data";

export function FleetShowcase() {
  return (
    <section className="py-24 bg-section-bg transition-colors duration-700 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-ink mb-6"
          >
            Our Premium Fleet
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-ink-muted"
          >
            Travel in supreme comfort. Our vehicles are meticulously maintained and sanitized for a luxurious journey.
          </motion.p>
        </div>

        <div className="flex overflow-hidden relative group -mx-4 px-4 md:mx-0 md:px-0">
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-8 md:w-32 bg-gradient-to-r from-section-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 md:w-32 bg-gradient-to-l from-section-bg to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] gap-6 pr-6 pb-8">
            {vehicles.map((vehicle, idx) => (
              <div
                key={`set1-${vehicle.id}-${idx}`}
                className="group relative bg-bg rounded-3xl overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col min-w-[85vw] md:min-w-[380px] shrink-0"
              >
                {vehicle.popular && (
                  <div className="absolute top-4 right-4 z-20 bg-accent-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="relative w-full h-64 overflow-hidden bg-black/5">
                  <Image 
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-ink mb-4">{vehicle.name}</h3>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                      <Users size={16} className="text-accent-secondary" />
                      {vehicle.capacity}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                      <Snowflake size={16} className="text-accent-secondary" />
                      {vehicle.specs.ac}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                      <Briefcase size={16} className="text-accent-secondary" />
                      {vehicle.specs.luggage}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs text-ink-muted mb-1">Perfect for</p>
                      <p className="text-sm font-semibold text-ink truncate">{vehicle.specs.bestFor}</p>
                    </div>
                    
                    <Link 
                      href="/booking"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-accent-primary text-white hover:bg-accent-secondary transition-colors font-medium text-sm shadow-sm shrink-0"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate set for seamless infinite scrolling */}
          <div className="flex w-max animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] gap-6 pr-6 pb-8" aria-hidden="true">
            {vehicles.map((vehicle, idx) => (
              <div
                key={`set2-${vehicle.id}-${idx}`}
                className="group relative bg-bg rounded-3xl overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col min-w-[85vw] md:min-w-[380px] shrink-0"
              >
                {vehicle.popular && (
                  <div className="absolute top-4 right-4 z-20 bg-accent-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="relative w-full h-64 overflow-hidden bg-black/5">
                  <Image 
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-ink mb-4">{vehicle.name}</h3>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                      <Users size={16} className="text-accent-secondary" />
                      {vehicle.capacity}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                      <Snowflake size={16} className="text-accent-secondary" />
                      {vehicle.specs.ac}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                      <Briefcase size={16} className="text-accent-secondary" />
                      {vehicle.specs.luggage}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs text-ink-muted mb-1">Perfect for</p>
                      <p className="text-sm font-semibold text-ink truncate">{vehicle.specs.bestFor}</p>
                    </div>
                    
                    <Link 
                      href="/booking"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-accent-primary text-white hover:bg-accent-secondary transition-colors font-medium text-sm shadow-sm shrink-0"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
