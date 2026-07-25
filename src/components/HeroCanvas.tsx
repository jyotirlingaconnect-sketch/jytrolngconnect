"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ProtectedAction } from "@/components/auth/ProtectedAction";
import { useFrameSequence, getFrame, shouldSkipAnimation } from "@/hooks/useFrameSequence";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  
  const frameIndexRef = useRef({ frame: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  // Use shared frame sequence loader (loads once for entire app)
  const { isInitialBatchReady } = useFrameSequence({
    enabled: !skipAnimation && !prefersReducedMotion,
  });

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check if device/connection suggests skipping animation
    setSkipAnimation(shouldSkipAnimation());
    
    const updateMotionPreference = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    // Don't setup scroll animation until initial batch is ready
    if (!isInitialBatchReady || prefersReducedMotion || skipAnimation) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Handle Resize
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      context.scale(dpr, dpr);
      renderFrame(frameIndexRef.current.frame);
    };

    const renderFrame = (index: number) => {
      // Use getFrame with fallback to nearest loaded frame
      const img = getFrame(index);
      if (!img) return;
      
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
      end: "+=3000",
      pin: true,
      onUpdate: (self) => {
        let frameIndex = Math.floor(self.progress * (FRAME_COUNT - 1));
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
  }, [isInitialBatchReady, prefersReducedMotion, skipAnimation]);

  // Show static image on mobile/slow connections or reduced motion
  const showStatic = prefersReducedMotion || skipAnimation;

  return (
    <div ref={containerRef} className="relative w-full h-[85dvh] sm:h-[90dvh] md:h-[100dvh] overflow-hidden bg-bg">
      {showStatic ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/frames/frame_000.webp)` }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            isInitialBatchReady ? "opacity-100" : "opacity-0"
          )}
          style={{ display: "block" }}
        />
      )}
      
      {/* Overlay gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0 pointer-events-none" />

      {/* Hero Content */}
      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 sm:px-6 transition-transform duration-75">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg opacity-90 transition-opacity leading-tight">
          A Journey of Devotion
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#FDEBD3] max-w-xs sm:max-w-lg md:max-w-2xl mb-6 md:mb-10 drop-shadow-md">
          Experience a divine pilgrimage from Mahakaleshwar to Omkareshwar with our premium, comfortable, and trusted travel services.
        </p>
        <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
          <ProtectedAction 
            href="/booking"
            className="inline-flex h-12 md:h-14 items-center justify-center whitespace-nowrap rounded-xl bg-accent-primary px-6 md:px-8 text-sm md:text-base font-medium text-surface shadow-md transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary pointer-events-auto min-w-[160px]"
          >
            Book Your Yatra
          </ProtectedAction>
        </div>
      </div>
    </div>
  );
}
