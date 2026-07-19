"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Heart, Navigation, Star, ShieldCheck } from "lucide-react";

export function PremiumStatistics() {
  const stats = [
    { value: 10000, suffix: "+", label: "Devotees Served", icon: Heart },
    { value: 500, suffix: "+", label: "Sacred Journeys", icon: Navigation },
    { value: 4.9, suffix: "★", label: "Spiritual Rating", icon: Star, decimals: 1 },
    { value: 100, suffix: "%", label: "Verified Fleet", icon: ShieldCheck },
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-section-bg text-ink z-10 transition-colors duration-700">
      {/* SVG Gradient Defs for Luxury Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#F5C451" offset="0%" />
            <stop stopColor="#D4AF6A" offset="50%" />
            <stop stopColor="#E28743" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layered Spiritual Background & Animated Gradients */}
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-accent-primary/20 dark:from-black/40 dark:via-transparent dark:to-accent-primary/10"
        style={{ backgroundSize: "200% 200%" }}
      />
      
      {/* Floating divine light orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-white/40 dark:bg-[#F5C451]/10 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-primary/30 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" 
      />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] mix-blend-overlay" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Premium Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 tracking-tight drop-shadow-sm text-ink dark:text-white">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Thousands</span>
          </h2>
          <p className="text-base md:text-lg text-ink-muted dark:text-white/60 font-light leading-relaxed">
            Our commitment to your spiritual journey is reflected in the milestones we&apos;ve achieved alongside our devotees.
          </p>
        </motion.div>

        {/* Floating Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative flex flex-col items-center text-center p-6 md:p-8 rounded-[2rem] bg-white/30 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/[0.06] hover:border-accent-primary/40 dark:hover:border-[#F5C451]/30 overflow-hidden"
            >
              {/* Card Inner Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/0 via-accent-primary/0 to-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Luxury SVG Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent-primary/20 dark:bg-[#F5C451]/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-16 h-16 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner group-hover:border-accent-primary/40 transition-colors duration-500">
                  <stat.icon 
                    size={32} 
                    strokeWidth={1.5} 
                    style={{ stroke: "url(#gold-gradient)" }}
                    className="drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(245,196,81,0.5)] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Counter */}
              <h3 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-ink to-ink/70 dark:from-white dark:to-white/70 mb-3 drop-shadow-sm group-hover:from-accent-primary group-hover:to-accent-secondary dark:group-hover:from-[#F5C451] dark:group-hover:to-[#FFE5B4] transition-all duration-500">
                <CountUp
                  end={stat.value}
                  decimals={stat.decimals || 0}
                  duration={3}
                  suffix={stat.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>

              {/* Premium Label */}
              <p className="text-xs font-semibold text-ink-muted dark:text-white/50 uppercase tracking-[0.2em] group-hover:text-ink dark:group-hover:text-white/80 transition-colors duration-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
