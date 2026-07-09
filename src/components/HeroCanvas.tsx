"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ frame: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const updateMotionPreference = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load images into refs (instantaneous because GlobalPreloader cached them)
    const loadImages = async () => {
      let loaded = 0;
      const promises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          const numStr = String(i).padStart(3, "0");
          img.src = `/frames/frame_${numStr}.png`;
          
          img.onload = () => {
            loaded++;
            setImagesLoaded(loaded);
            resolve(img);
          };
          img.onerror = () => {
            loaded++;
            setImagesLoaded(loaded);
            resolve(null);
          };
          imagesRef.current[i] = img;
        });
      });
      await Promise.all(promises);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (imagesLoaded < FRAME_COUNT || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Handle Resize
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      context.scale(dpr, dpr);
      renderFrame(frameIndexRef.current.frame);
    };

    const renderFrame = (index: number) => {
      if (!imagesRef.current[index] || !imagesRef.current[index].complete) return;
      
      const img = imagesRef.current[index];
      const canvasWidth = container.clientWidth;
      const canvasHeight = container.clientHeight;
      
      // Cover logic (like object-fit: cover)
      const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
      const x = (canvasWidth / 2) - (img.width / 2) * scale;
      const y = (canvasHeight / 2) - (img.height / 2) * scale;
      
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Setup ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=3000", // Scroll distance
      pin: true,
      onUpdate: (self) => {
        // Calculate frame index based on scroll progress
        let frameIndex = Math.floor(self.progress * (FRAME_COUNT - 1));
        // Ensure within bounds
        frameIndex = Math.max(0, Math.min(frameIndex, FRAME_COUNT - 1));
        
        if (frameIndexRef.current.frame !== frameIndex) {
          frameIndexRef.current.frame = frameIndex;
          requestAnimationFrame(() => renderFrame(frameIndex));
        }

        // Fade out text during the first 15% of scroll
        if (textRef.current) {
          const fadeProgress = Math.min(1, self.progress / 0.15);
          textRef.current.style.opacity = (1 - fadeProgress).toString();
          textRef.current.style.transform = `translateY(${fadeProgress * -30}px)`;
          textRef.current.style.pointerEvents = fadeProgress > 0.5 ? 'none' : 'auto';
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      st.kill();
    };
  }, [imagesLoaded, prefersReducedMotion]);

  const isLoading = imagesLoaded < FRAME_COUNT;

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden bg-bg">
      {prefersReducedMotion ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/frames/frame_000.png)` }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          style={{ display: "block" }}
        />
      )}
      
      {/* Overlay gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0 pointer-events-none" />

      {/* Hero Content positioned statically inside the pinned container */}
      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 transition-transform duration-75">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg opacity-90 transition-opacity">
          A Journey of Devotion
        </h1>
        <p className="text-lg md:text-xl text-[#FDEBD3] max-w-2xl mb-10 drop-shadow-md">
          Experience a divine pilgrimage from Mahakaleshwar to Omkareshwar with our premium, comfortable, and trusted travel services.
        </p>
        <a 
          href="/booking"
          className="inline-flex h-14 items-center justify-center whitespace-nowrap rounded-xl bg-accent-primary px-8 text-base font-medium text-surface shadow-md transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary pointer-events-auto"
        >
          Book Your Yatra
        </a>
      </div>
    </div>
  );
}
