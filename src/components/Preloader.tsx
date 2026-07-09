"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "Preparing Your Sacred Journey...",
  "Loading Divine Experience...",
  "Welcome to Jyotirling Connect...",
  "Getting Everything Ready..."
];

interface PreloaderProps {
  isLoading: boolean;
  progress?: number; // 0 to 100
}

export function Preloader({ isLoading, progress = 0 }: PreloaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate messages every 2.5 seconds
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-bg overflow-hidden w-screen h-[100dvh] pointer-events-auto"
        >
          {/* Subtle Glowing Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg to-bg overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.25, 0.15]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-accent-primary/20 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/3 left-1/3 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-accent-secondary/20 rounded-full blur-[120px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
            
            {/* Elegant Spinner / Lottie Container */}
            <motion.div 
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.6 } }}
              className="w-48 h-48 sm:w-64 sm:h-64 mb-8 flex items-center justify-center relative"
            >
              {/* Premium CSS Fallback/Background Spinner */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 sm:w-40 sm:h-40 border-[1px] border-accent-primary/50 rounded-full border-dashed"
                 />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute w-40 h-40 sm:w-48 sm:h-48 border-[1px] border-accent-secondary/40 rounded-full border-dotted"
                 />
                 <div className="absolute w-20 h-20 bg-accent-primary/10 rounded-full blur-xl" />
              </div>
              
              {/* Lottie File - Uncomment and add your own JSON file path here */}
              {/* <LottieAnimation 
                path="/lottie/spiritual-spinner.json"
                className="w-full h-full z-10 drop-shadow-2xl opacity-90"
              /> */}
            </motion.div>

            {/* Logo */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-display font-bold text-accent-primary mb-8"
            >
              Jyotirling<span className="text-ink">Connect</span>
            </motion.div>

            {/* Rotating Messages */}
            <div className="h-6 mb-8 relative w-full text-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 text-sm md:text-base text-ink-muted font-medium tracking-wide"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            <div className="w-full max-w-[240px] h-[2px] bg-border/80 rounded-full overflow-hidden relative backdrop-blur-sm">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-primary rounded-full shadow-[0_0_10px_rgba(166,58,30,0.6)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-widest text-ink-muted/50 font-bold tabular-nums">
              {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
