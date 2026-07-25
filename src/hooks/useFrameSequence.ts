/**
 * Shared frame sequence loader with progressive loading strategy
 * Loads frames once per session and provides loading state to multiple consumers
 */

import { useState, useEffect, useRef } from "react";

const FRAME_COUNT = 240;
const INITIAL_BATCH_SIZE = 20; // First frames for immediate hero render
const BACKGROUND_BATCH_SIZE = 15; // Subsequent batches loaded progressively
const HARD_TIMEOUT_MS = 6000; // 6 seconds max wait for critical content

// Module-level cache — shared across all component instances
const frameCache = new Map<number, HTMLImageElement>();
const loadingPromises = new Map<number, Promise<HTMLImageElement | null>>();
let globalLoadedCount = 0;
const subscribers = new Set<(count: number) => void>();

interface UseFrameSequenceOptions {
  enabled?: boolean; // Allow conditional loading (e.g., skip on mobile)
}

interface UseFrameSequenceReturn {
  frames: HTMLImageElement[];
  loadedCount: number;
  progress: number; // 0-100
  isInitialBatchReady: boolean;
  isComplete: boolean;
  timedOut: boolean;
}

/**
 * Subscribe to frame loading progress
 */
function notifySubscribers() {
  subscribers.forEach((callback) => callback(globalLoadedCount));
}

/**
 * Load a single frame with caching
 */
function loadFrame(index: number): Promise<HTMLImageElement | null> {
  // Return cached frame if available
  if (frameCache.has(index)) {
    return Promise.resolve(frameCache.get(index)!);
  }

  // Return existing loading promise if already in progress
  if (loadingPromises.has(index)) {
    return loadingPromises.get(index)!;
  }

  // Create new loading promise
  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    const numStr = String(index).padStart(3, "0");
    
    img.onload = () => {
      frameCache.set(index, img);
      globalLoadedCount++;
      notifySubscribers();
      resolve(img);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load frame ${index}`);
      globalLoadedCount++;
      notifySubscribers();
      resolve(null);
    };

    // Use fetchpriority for initial batch
    if (index < INITIAL_BATCH_SIZE) {
      img.fetchPriority = "high";
    } else {
      img.fetchPriority = "low";
    }
    
    img.src = `/frames/frame_${numStr}.webp`;
  });

  loadingPromises.set(index, promise);
  return promise;
}

/**
 * Load frames in progressive batches using requestIdleCallback
 */
async function loadProgressiveBatches(
  startIndex: number,
  endIndex: number,
  onBatchComplete?: () => void
) {
  const requestIdleCallbackFallback = (callback: IdleRequestCallback) => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline), 0);
  };

  const requestIdle = typeof requestIdleCallback !== "undefined" 
    ? requestIdleCallback 
    : requestIdleCallbackFallback;

  let currentIndex = startIndex;

  const loadNextBatch = () => {
    if (currentIndex >= endIndex) {
      onBatchComplete?.();
      return;
    }

    const batchEnd = Math.min(currentIndex + BACKGROUND_BATCH_SIZE, endIndex);
    const batchPromises: Promise<HTMLImageElement | null>[] = [];

    for (let i = currentIndex; i < batchEnd; i++) {
      batchPromises.push(loadFrame(i));
    }

    Promise.all(batchPromises).then(() => {
      currentIndex = batchEnd;
      // Schedule next batch during idle time
      requestIdle(loadNextBatch);
    });
  };

  requestIdle(loadNextBatch);
}

/**
 * Main hook for consuming frame sequence
 */
export function useFrameSequence(
  options: UseFrameSequenceOptions = {}
): UseFrameSequenceReturn {
  const { enabled = true } = options;
  
  const [loadedCount, setLoadedCount] = useState(globalLoadedCount);
  const [isInitialBatchReady, setIsInitialBatchReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const loadingStartedRef = useRef(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Subscribe to global loading updates
    const handleUpdate = (count: number) => {
      setLoadedCount(count);
    };
    subscribers.add(handleUpdate);

    // Start loading if not already started
    if (!loadingStartedRef.current) {
      loadingStartedRef.current = true;

      // Hard timeout — force ready state after max wait
      timeoutIdRef.current = setTimeout(() => {
        console.warn("Frame loading timed out after 6s — continuing anyway");
        setTimedOut(true);
        setIsInitialBatchReady(true);
      }, HARD_TIMEOUT_MS);

      // Load initial batch with high priority
      const initialBatchPromises = Array.from({ length: INITIAL_BATCH_SIZE }, (_, i) =>
        loadFrame(i)
      );

      Promise.all(initialBatchPromises).then(() => {
        setIsInitialBatchReady(true);
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }

        // Start loading remaining frames in background
        loadProgressiveBatches(INITIAL_BATCH_SIZE, FRAME_COUNT);
      });
    } else if (globalLoadedCount >= INITIAL_BATCH_SIZE) {
      // Already loaded — immediately set ready
      setIsInitialBatchReady(true);
    }

    return () => {
      subscribers.delete(handleUpdate);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [enabled]);

  // Build frames array from cache
  const frames = Array.from({ length: FRAME_COUNT }, (_, i) => 
    frameCache.get(i)
  ).filter((img): img is HTMLImageElement => img !== undefined);

  const progress = Math.min(100, Math.round((loadedCount / FRAME_COUNT) * 100));
  const isComplete = loadedCount >= FRAME_COUNT;

  return {
    frames,
    loadedCount,
    progress,
    isInitialBatchReady,
    isComplete,
    timedOut,
  };
}

/**
 * Get a specific frame by index (with fallback to nearest loaded frame)
 */
export function getFrame(index: number): HTMLImageElement | null {
  // Try exact match
  if (frameCache.has(index)) {
    return frameCache.get(index)!;
  }

  // Fallback: find nearest lower loaded frame
  for (let i = index - 1; i >= 0; i--) {
    if (frameCache.has(i)) {
      return frameCache.get(i)!;
    }
  }

  // Last resort: return first frame if available
  return frameCache.get(0) || null;
}

/**
 * Check if device/connection suggests skipping animation
 * NOW ONLY checks connection quality, NOT viewport width
 */
export function shouldSkipAnimation(): boolean {
  if (typeof window === "undefined") return false;

  // Check connection quality only (saveData or slow connection)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isSlow = connection && 
    (connection.saveData || 
     ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

  return !!isSlow;
}

/**
 * Detect if we're on a mobile device (for mobile-specific optimizations)
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
