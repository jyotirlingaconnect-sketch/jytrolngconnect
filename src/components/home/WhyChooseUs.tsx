"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Heart, Map } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Trusted Safety",
    desc: "Verified drivers with years of experience on sacred routes, ensuring your absolute peace of mind.",
  },
  {
    icon: Clock,
    title: "On-Time Service",
    desc: "Punctuality is our promise. We meticulously plan your journey so you never miss an Aarti.",
  },
  {
    icon: Heart,
    title: "Devotional Care",
    desc: "Atithi Devo Bhava – we treat every pilgrim with the utmost respect, warmth, and dedication.",
  },
  {
    icon: Map,
    title: "Local Guidance",
    desc: "Expert knowledge of routes, timing, and local temples to enrich your spiritual experience.",
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-transparent z-10">
      
      {/* SVG Gradient Defs for Luxury Icons (Lottie Alternative) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#F5C451" offset="0%" />
            <stop stopColor="#D4AF6A" offset="50%" />
            <stop stopColor="#FFE5B4" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle Premium Background Decorations */}
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

      {/* Seamless Transition Mask - Hides any GSAP unpin gaps by fading into the next section */}
      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 bg-gradient-to-b from-transparent via-section-bg/80 to-section-bg z-0 pointer-events-none transition-colors duration-700" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Premium Heading Area */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 mb-4 shadow-sm"
          >
            <span className="text-accent-secondary">✨</span>
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-ink dark:text-white/90">Trusted Pilgrimage Experience</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ink dark:text-white mb-4 tracking-tight drop-shadow-sm"
          >
            Why Travel With <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Us</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-base md:text-lg text-ink-muted dark:text-white/70 font-light leading-relaxed max-w-2xl"
          >
            Thousands of pilgrims trust us every year to make their sacred journey comfortable, safe, and truly memorable.
          </motion.p>
        </div>

        {/* Premium Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.02, rotateX: 2 }}
              className="group relative perspective-1000"
            >
              <div className="relative h-full w-full rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center text-center overflow-hidden bg-white/30 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-accent-secondary/50 group-hover:shadow-[0_30px_60px_-15px_rgba(212,175,106,0.3)] group-hover:bg-white/50 dark:group-hover:bg-white/[0.08]">
                
                {/* Dynamic Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent-secondary/0 via-accent-secondary/0 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Lottie Container (Floating Glass Circle) */}
                <div className="relative mb-6 mt-2">
                  {/* Outer Ambient Glow */}
                  <div className="absolute inset-0 bg-accent-secondary/30 dark:bg-[#F5C451]/20 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Glass Circle */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-20 h-20 rounded-full bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/20 flex items-center justify-center backdrop-blur-md shadow-inner group-hover:border-accent-secondary/60 transition-colors duration-500"
                  >
                    {/* Inner Rotating Aura */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-accent-secondary/30 animate-[spin_10s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Animated Icon (Luxury SVG) */}
                    <motion.div
                      animate={{ 
                        y: [0, -3, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: i * 0.2 // Stagger the floating animation
                      }}
                    >
                      <feature.icon 
                        size={32} 
                        strokeWidth={1.2} 
                        style={{ stroke: "url(#gold-gradient)" }}
                        className="drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(245,196,81,0.5)] group-hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>
                  </motion.div>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-ink dark:text-white mb-3 relative z-10 drop-shadow-sm group-hover:text-accent-primary dark:group-hover:text-accent-secondary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Small Divider */}
                <div className="w-10 h-[2px] bg-accent-secondary/30 mb-4 rounded-full group-hover:w-16 group-hover:bg-accent-secondary transition-all duration-500" />
                
                <p className="text-xs md:text-sm text-ink-muted dark:text-white/60 leading-relaxed relative z-10 font-medium">
                  {feature.desc}
                </p>

                {/* Animated Bottom Border Sweep */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent w-0 group-hover:w-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
