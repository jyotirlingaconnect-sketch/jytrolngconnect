"use client";

import { useEffect } from "react";

/**
 * GlobalPreloader — NO LONGER BLOCKS THE ENTIRE APP
 * 
 * Previous behavior: blocked all content behind Promise.all() on 240 images
 * New behavior: just preloads fonts, children render immediately
 * 
 * Frame loading is now handled by useFrameSequence hook in HeroCanvas
 */
export function GlobalPreloader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Preload fonts for smoother text rendering (non-blocking)
    if (typeof window !== "undefined") {
      document.fonts.ready.catch(() => {
        // Font loading failure is non-critical
      });
    }
  }, []);

  // Children render immediately — no blocking, no opacity tricks, no pointer-events blocking
  return <>{children}</>;
}
