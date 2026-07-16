"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Simple pseudo-random number generator
const prng = (seed: number) => {
  const m = 1e8;
  const a = 1103515245;
  const c = 12345;
  let state = seed ? seed : Math.floor(Math.random() * (m - 1));
  
  return function() {
    state = (a * state + c) % m;
    return state / (m - 1);
  }
};

export function FloatingParticles() {
  const particles = useMemo(() => {
    const random = prng(12345);
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: random() * 4 + 1,
      x: random() * 100,
      y: random() * 100,
      duration: random() * 20 + 20,
      delay: random() * 5,
      // store the random x offset array for animation
      xOffset: (random() - 0.5) * 50
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {/* Blurred gradient circles (Lens flares) */}
      <motion.div 
        className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-accent-primary/20 rounded-full blur-[100px] md:blur-[140px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-accent-secondary/20 rounded-full blur-[100px] md:blur-[140px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Tiny floating light dots */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/60 blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, p.xOffset, 0],
            opacity: [0.1, 0.8, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
