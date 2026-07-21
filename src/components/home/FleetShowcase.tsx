"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame, animate, useMotionValueEvent } from "framer-motion";
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
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateWidthAndMedia = () => {
      if (blockRef.current) {
        const width = blockRef.current.offsetWidth;
        setBlockWidth(width);
        // Start in the middle safe zone
        x.set(-width);
      }
      setIsMobile(window.innerWidth < 768);
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    
    updateWidthAndMedia();
    // Delay to ensure images/layout styles are fully calculated
    const timeout = setTimeout(updateWidthAndMedia, 150);
    window.addEventListener("resize", updateWidthAndMedia);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidthAndMedia);
    };
  }, [x]);

  // Track active item index for mobile pagination indicators
  useMotionValueEvent(x, "change", (latest) => {
    if (blockWidth > 0 && vehicles.length > 0) {
      const positiveOffset = ((-latest % blockWidth) + blockWidth) % blockWidth;
      const cardStep = blockWidth / vehicles.length;
      const index = Math.floor((positiveOffset + cardStep * 0.3) / cardStep) % vehicles.length;
      setActiveIndex(index);
    }
  });

  useAnimationFrame((t, delta) => {
    if (isHovered || isScrolling || !blockWidth || prefersReducedMotion) return;

    // Slightly slower auto-scroll on mobile devices for smooth readability
    const speed = isMobile ? 0.03 : 0.05;
    let newX = x.get() - delta * speed;

    if (newX <= -(blockWidth * 2)) {
      newX += blockWidth;
    }

    x.set(newX);
  });

  const handleScroll = (direction: "left" | "right") => {
    if (!blockWidth || isScrolling) return;
    
    setIsScrolling(true);
    
    // Calculate precise card width + gap from DOM dynamically for exact alignment at any screen size
    let scrollAmount = 384;
    if (blockRef.current && blockRef.current.children.length > 0) {
      const firstCard = blockRef.current.children[0] as HTMLElement;
      if (firstCard) {
        const style = window.getComputedStyle(blockRef.current);
        const gap = parseFloat(style.gap || "24") || 24;
        scrollAmount = firstCard.offsetWidth + gap;
      }
    }
    
    let currentX = x.get();
    
    if (direction === "left") {
      // If moving right (backward in list), check wrap
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
      className="group/card relative bg-bg rounded-2xl md:rounded-3xl overflow-hidden border border-border/70 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col w-[88vw] sm:w-[85vw] sm:max-w-[400px] md:w-[320px] lg:w-[360px] xl:w-[380px] 2xl:w-[400px] shrink-0"
    >
      {vehicle.popular && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-accent-primary/95 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-lg backdrop-blur-xs tracking-wide">
          Most Popular
        </div>
      )}
      
      <div className="relative w-full h-48 sm:h-56 md:h-60 lg:h-64 xl:h-72 overflow-hidden bg-black/5 dark:bg-white/5">
        <Image 
          src={vehicle.image}
          alt={vehicle.name}
          fill
          loading="lazy"
          className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 340px, (max-width: 1280px) 360px, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-5 sm:p-6 lg:p-8 flex-1 flex flex-col">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink mb-3 sm:mb-4 tracking-tight leading-snug">
          {vehicle.name}
        </h3>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted bg-surface dark:bg-surface/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-border/50 dark:border-white/10 shrink-0">
            <Users size={15} className="text-accent-secondary shrink-0" />
            <span>{vehicle.capacity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted bg-surface dark:bg-surface/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-border/50 dark:border-white/10 shrink-0">
            <Snowflake size={15} className="text-accent-secondary shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-none">{vehicle.specs.ac}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted bg-surface dark:bg-surface/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-border/50 dark:border-white/10 shrink-0">
            <Briefcase size={15} className="text-accent-secondary shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-none">{vehicle.specs.luggage}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/60 dark:border-white/10 pt-4 sm:pt-6 gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-ink-muted uppercase tracking-wider mb-0.5">Perfect for</p>
            <p className="text-xs sm:text-sm font-semibold text-ink truncate">{vehicle.specs.bestFor}</p>
          </div>
          
          <Link 
            href="/booking"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-accent-primary text-white hover:bg-accent-secondary transition-all duration-300 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shrink-0 min-h-[44px] min-w-[96px] focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-10 sm:py-14 md:py-20 bg-section-bg transition-colors duration-700 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-ink mb-3 sm:mb-4 lg:mb-5 tracking-tight"
          >
            Our Premium Fleet
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-ink-muted leading-relaxed"
          >
            Travel in supreme comfort. Our vehicles are meticulously maintained and sanitized for a luxurious journey.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="flex overflow-hidden relative group -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-y">
          {/* Fading Edges - adjusted responsively */}
          <div className="absolute top-0 bottom-0 left-0 w-4 sm:w-8 md:w-20 lg:w-32 bg-gradient-to-r from-section-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-4 sm:w-8 md:w-20 lg:w-32 bg-gradient-to-l from-section-bg to-transparent z-10 pointer-events-none" />
          
          {/* Desktop/Tablet Floating Controls */}
          <button 
             onClick={() => handleScroll("left")}
             className="hidden md:flex absolute left-2 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 min-w-[48px] min-h-[48px] w-12 h-12 bg-white/85 dark:bg-bg/85 backdrop-blur-md border border-border dark:border-white/10 rounded-full items-center justify-center text-ink hover:bg-white dark:hover:bg-bg hover:scale-110 active:scale-95 transition-all shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none cursor-pointer"
             aria-label="Previous vehicle"
          >
             <ChevronLeft size={24} />
          </button>
          
          <button 
             onClick={() => handleScroll("right")}
             className="hidden md:flex absolute right-2 md:right-6 lg:left-auto lg:right-8 top-1/2 -translate-y-1/2 z-30 min-w-[48px] min-h-[48px] w-12 h-12 bg-white/85 dark:bg-bg/85 backdrop-blur-md border border-border dark:border-white/10 rounded-full items-center justify-center text-ink hover:bg-white dark:hover:bg-bg hover:scale-110 active:scale-95 transition-all shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none cursor-pointer"
             aria-label="Next vehicle"
          >
             <ChevronRight size={24} />
          </button>

          {/* Carousel Track */}
          <motion.div 
            className="flex w-max pb-4 sm:pb-6 md:pb-8 cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -(blockWidth * 2) - 300, right: 300 }}
            dragElastic={0.05}
            onDragStart={() => setIsScrolling(true)}
            onDragEnd={() => {
              setIsScrolling(false);
              if (!blockWidth) return;
              let currentX = x.get();
              if (currentX <= -(blockWidth * 2)) {
                x.set(currentX + blockWidth);
              } else if (currentX >= 0) {
                x.set(currentX - blockWidth);
              }
            }}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
          >
            <div ref={blockRef} className="flex gap-4 sm:gap-5 lg:gap-6 pr-4 sm:pr-5 lg:pr-6 shrink-0">
              {vehicles.map((v, i) => renderVehicle(v, i, "set1"))}
            </div>
            <div className="flex gap-4 sm:gap-5 lg:gap-6 pr-4 sm:pr-5 lg:pr-6 shrink-0">
              {vehicles.map((v, i) => renderVehicle(v, i, "set2"))}
            </div>
            <div className="flex gap-4 sm:gap-5 lg:gap-6 pr-4 sm:pr-5 lg:pr-6 shrink-0">
              {vehicles.map((v, i) => renderVehicle(v, i, "set3"))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Navigation Controls (Below Carousel) */}
        <div className="flex md:hidden items-center justify-between gap-4 mt-6 sm:mt-8 px-2 max-w-xs mx-auto">
          <button
            onClick={() => handleScroll("left")}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-w-[48px] min-h-[48px] rounded-full bg-surface dark:bg-surface/90 border border-border/70 dark:border-white/10 text-ink font-semibold text-xs shadow-sm active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none"
            aria-label="Previous vehicle"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          {/* Indicator dots for mobile */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {vehicles.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 bg-accent-primary"
                    : "w-2 bg-border/80 dark:bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-w-[48px] min-h-[48px] rounded-full bg-surface dark:bg-surface/90 border border-border/70 dark:border-white/10 text-ink font-semibold text-xs shadow-sm active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none"
            aria-label="Next vehicle"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

