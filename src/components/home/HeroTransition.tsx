"use client";

import { motion } from "framer-motion";

export function HeroTransition() {
  return (
    <section className="relative w-full h-32 md:h-48 -mt-10 z-20 pointer-events-none">
      {/* Gradient fading from dark hero to light bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-surface/80 to-bg backdrop-blur-md" />
      
      {/* Decorative floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          { width: 120, height: 95, left: "15%", top: "25%", duration: 4.2 },
          { width: 80, height: 110, left: "75%", top: "45%", duration: 3.5 },
          { width: 140, height: 140, left: "45%", top: "15%", duration: 4.8 },
          { width: 90, height: 90, left: "85%", top: "75%", duration: 3.1 },
          { width: 110, height: 100, left: "25%", top: "65%", duration: 3.9 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent-secondary/30 blur-xl"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* SVG curve for smooth transition */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[50px] md:h-[80px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.32,201.39,115.5Z"
            className="fill-bg"
          ></path>
        </svg>
      </div>
    </section>
  );
}
