"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ProtectedAction } from "@/components/auth/ProtectedAction";
import { useFrameSequence, getFrame, shouldSkipAnimation, isMobileDevice } from "@/hooks/useFrameSequence";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
// Responsive scroll distances based on viewport
const DESKTOP_SCROLL_DISTANCE = 3000;
const MOBILE_SCROLL_DISTANCE = 2000; // Shorter for mobile to feel more intentional

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const frameIndexRef = useRef({ frame: 0 });
  const textRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastRenderFrameRef = useRef<number>(-1);

  // Use shared frame sequence loader (loads once for entire app)
  const { isInitialBatchReady } = useFrameSequence({
    enabled: !skipAnimation && !prefersReducedMotion,
  });

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check if connection suggests skipping animation (NOT viewport)
    setSkipAnimation(shouldSkipAnimation());
    
    // Check if we're on mobile for optimizations
    setIsMobile(isMobileDevice());
    
    const updateMotionPreference = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  // Enable GSAP normalizeScroll for mobile to smooth out iOS address bar behavior
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Only apply normalizeScroll on mobile devices
    // This prevents iOS Safari address bar from causing pin jumps
    // Based on established GSAP documentation for iOS Safari pin behavior
    if (isMobileDevice()) {
      ScrollTrigger.normalizeScroll(true);
      
      return () => {
        ScrollTrigger.normalizeScroll(false);
      };
    }
  }, []);

  // Memoized render function with throttling for mobile
  const renderFrame = useCallback((index: number) => {
    // Throttle redundant renders — don't redraw same frame
    if (lastRenderFrameRef.current === index) return;
    lastRenderFrameRef.current = index;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
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
  }, []);

  useEffect(() => {
    // Don't setup scroll animation until initial batch is ready
    if (!isInitialBatchReady || prefersReducedMotion || skipAnimation) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Mobile-specific DPR capping for performance
    // Lower DPR on mobile reduces GPU/CPU load during scroll
    // Visual difference is negligible on small screens during motion
    const getMobileDPR = () => {
      if (isMobile) {
        // Cap at 1.5 on mobile instead of 2 for better performance
        return Math.min(window.devicePixelRatio || 1, 1.5);
      }
      return Math.min(window.devicePixelRatio || 1, 2);
    };

    // Handle Resize with debouncing for iOS address bar rapid-fire resizes
    const resizeCanvas = () => {
      const dpr = getMobileDPR();
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      context.scale(dpr, dpr);
      renderFrame(frameIndexRef.current.frame);
    };

    // Debounced refresh for iOS address bar show/hide
    // iOS Safari fires rapid resize events during momentum scroll
    // Debouncing prevents layout thrashing and jumps
    const debouncedRefresh = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        if (scrollTriggerRef.current) {
          ScrollTrigger.refresh();
        }
      }, 150); // 150ms debounce for iOS address bar transitions
    };

    const handleResize = () => {
      resizeCanvas();
      // Only debounced refresh on mobile to handle address bar
      if (isMobile) {
        debouncedRefresh();
      }
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();

    // Responsive scroll distance based on viewport
    const scrollDistance = isMobile ? MOBILE_SCROLL_DISTANCE : DESKTOP_SCROLL_DISTANCE;

    // Setup ScrollTrigger with mobile-optimized config
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${scrollDistance}`, // Responsive based on device
      pin: true,
      // anticipatePin: iOS Safari may recalculate during address bar transitions
      // normalizeScroll (enabled above) should prevent most issues
      anticipatePin: isMobile ? 1 : 0, // Small anticipation on mobile helps with momentum scroll
      onUpdate: (self) => {
        let frameIndex = Math.floor(self.progress * (FRAME_COUNT - 1));
        frameIndex = Math.max(0, Math.min(frameIndex, FRAME_COUNT - 1));
        
        if (frameIndexRef.current.frame !== frameIndex) {
          frameIndexRef.current.frame = frameIndex;
          // requestAnimationFrame ensures smooth rendering synced with browser paint
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

    scrollTriggerRef.current = st;

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [isInitialBatchReady, prefersReducedMotion, skipAnimation, isMobile, renderFrame]);

  // Show static image on slow connections or reduced motion
  // Mobile now gets the animation (unless connection is slow)
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
        <h1 className="mb-2 sm:mb-3 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.18em] text-[#FDEBD3] drop-shadow-md">
          Ujjain to Omkareshwar Taxi &amp; Jyotirlinga Yatra
        </h1>
        <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg opacity-90 transition-opacity leading-tight">
          A Journey of Devotion
        </p>
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
