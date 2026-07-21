"use client";

import { useGalleryImages } from "./cta/useGalleryImages";
import { AnimatedGalleryBackground } from "./cta/AnimatedGalleryBackground";
import { FloatingParticles } from "./cta/FloatingParticles";
import { GlassCTA } from "./cta/GlassCTA";
import { useReducedMotion } from "framer-motion";

export function CTASection() {
  const { images, loading } = useGalleryImages();
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, we can just show the first image static or a simplified version
  // For now, we will still show the animated background but maybe in a simpler way if needed.
  // We'll just render it as is, or you could conditionally swap AnimatedGalleryBackground for a static one.

  return (
    <section className="relative py-16 md:py-24 overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center bg-ink">
      {!loading && !shouldReduceMotion && (
        <AnimatedGalleryBackground images={images} />
      )}
      
      {/* Fallback for reduced motion or loading state */}
      {(loading || shouldReduceMotion) && (
        <div className="absolute inset-0 z-0 bg-ink">
           <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink/80 backdrop-blur-[4px] z-10" />
           {images.length > 0 && (
             <img 
               src={images[0].image_url} 
               alt="Background" 
               className="w-full h-full object-cover opacity-50"
             />
           )}
        </div>
      )}

      <FloatingParticles />
      <GlassCTA />
    </section>
  );
}
