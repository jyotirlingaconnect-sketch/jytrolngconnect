"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Preloader } from "./Preloader";

const FRAME_COUNT = 240;

export function GlobalPreloader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Lock scrolling on body while loading
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (prefersReducedMotion) {
      setIsReady(true);
      document.body.style.overflow = "";
      return;
    }

    const preloadAssets = async () => {
      let loaded = 0;
      
      // Wait for fonts to be ready
      try {
        await document.fonts.ready;
      } catch {
        // Font loading failure is non-critical — layout still renders
      }

      // Preload images in parallel (browser handles queueing)
      const imagePromises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          const numStr = String(i).padStart(3, "0");
          
          img.onload = () => {
            loaded++;
            setImagesLoaded(loaded);
            resolve(true);
          };
          img.onerror = () => {
            loaded++;
            setImagesLoaded(loaded);
            resolve(false);
          };
          
          img.src = `/frames/frame_${numStr}.webp`;
        });
      });

      await Promise.all(imagePromises);
      
      // Ensure smooth fade transition before mounting app
      setTimeout(() => {
        setIsReady(true);
        document.body.style.overflow = "";
      }, 500); // Give 500ms for Preloader to finish reaching 100% before triggering exit
    };

    preloadAssets();
  }, [prefersReducedMotion]);

  const progress = Math.min(100, Math.round((imagesLoaded / FRAME_COUNT) * 100));

  return (
    <>
      <AnimatePresence mode="wait">
        {!isReady && (
          <Preloader isLoading={!isReady} progress={progress} />
        )}
      </AnimatePresence>

      {/* Always mount children — opacity/pointer-events hide them until ready */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full"
        style={{ pointerEvents: isReady ? "auto" : "none" }}
      >
        {children}
      </motion.div>
    </>
  );
}
