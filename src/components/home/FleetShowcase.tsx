"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Snowflake, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

import { vehicles } from "@/lib/fleet-data";

export function FleetShowcase() {
  const x = useMotionValue(0);
  const blockRef = useRef<HTMLDivElement>(null);
  const [blockWidth, setBlockWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (blockRef.current) {
        const width = blockRef.current.offsetWidth;
        setBlockWidth(width);
        // Start in the middle safe zone
        x.set(-width);
      }
    };
    
    updateWidth();
    // Slight delay to ensure images/fonts are loaded before final width is calculated
    const timeout = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, [x]);

  useAnimationFrame((t, delta) => {
    if (isHovered || isScrolling || !blockWidth) return;

    let newX = x.get() - (delta * 0.05);

    if (newX <= -(blockWidth * 2)) {
      newX += blockWidth;
    }

    x.set(newX);
  });

  const handleScroll = (direction: "left" | "right") => {
    if (!blockWidth || isScrolling) return;
    
    setIsScrolling(true);
    
    // We scroll by one item width approximately (380px item + 24px gap = 404)
    const scrollAmount = 404;
    let currentX = x.get();
    
    if (direction === "left") {
      // If moving right (backward in list), check if we need to wrap first
      if (currentX + scrollAmount > 0) {
        currentX -= blockWidth;
        x.set(currentX);
      }
    } else {
      // If moving left (forward in list), check wrap
      if (currentX - scrollAmount < -(blockWidth * 2)) {
        currentX += blockWidth;
        x.set(currentX);
      }
    }

    const targetX = direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    animate(x, targetX, {
      type: "tween",
      ease: "easeInOut",
      duration: 0.5,
      onComplete: () => setIsScrolling(false)
    });
  };

  const renderVehicle = (vehicle: typeof vehicles[0], idx: number, prefix: string) => (
    <div
      key={`${prefix}-${vehicle.id}-${idx}`}
      className="group/card relative bg-bg rounded-3xl overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col min-w-[85vw] md:min-w-[380px] shrink-0"
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
          className="object-cover group-hover/card:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 380px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
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
  );

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
          
          {/* Controls */}
          <button 
             onClick={() => handleScroll("left")}
             className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 dark:bg-bg/80 backdrop-blur-md border border-border rounded-full flex items-center justify-center text-ink hover:bg-white dark:hover:bg-bg hover:scale-110 transition-all shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100"
             aria-label="Previous"
          >
             <ChevronLeft size={24} />
          </button>
          
          <button 
             onClick={() => handleScroll("right")}
             className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 dark:bg-bg/80 backdrop-blur-md border border-border rounded-full flex items-center justify-center text-ink hover:bg-white dark:hover:bg-bg hover:scale-110 transition-all shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100"
             aria-label="Next"
          >
             <ChevronRight size={24} />
          </button>

          <motion.div 
            className="flex w-max pb-8"
            style={{ x }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div ref={blockRef} className="flex gap-6 pr-6 shrink-0">
              {vehicles.map((v, i) => renderVehicle(v, i, "set1"))}
            </div>
            <div className="flex gap-6 pr-6 shrink-0">
              {vehicles.map((v, i) => renderVehicle(v, i, "set2"))}
            </div>
            <div className="flex gap-6 pr-6 shrink-0">
              {vehicles.map((v, i) => renderVehicle(v, i, "set3"))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
