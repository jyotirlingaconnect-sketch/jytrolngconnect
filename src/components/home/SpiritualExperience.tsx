"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGalleryImages } from "./cta/useGalleryImages";

export function SpiritualExperience() {
  const benefits = [
    "Priority Darshan Assistance",
    "Local Guide Accompaniment",
    "Clean & Sanitized Vehicles",
    "Flexible Stoppages",
  ];

  const { images } = useGalleryImages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const fallbackUrl = "https://images.unsplash.com/photo-1623910385966-eb18a2872338?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="py-16 md:py-20 bg-transparent relative z-20 overflow-hidden">
      {/* Immersive ambient glows */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Image Side - Floating Premium Card */}
          <motion.div 
            initial={{ opacity: 0, x: -40, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative perspective-1000"
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 group"
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl z-0" />
              
              <AnimatePresence>
                <motion.div
                  key={images.length > 0 ? images[currentImageIndex].id : "fallback"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={images.length > 0 ? images[currentImageIndex].image_url : fallbackUrl} 
                    alt={images.length > 0 ? (images[currentImageIndex].title || "Premium Temple Experience") : "Premium Temple Experience"} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 z-0"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={images.length > 0 ? images[currentImageIndex].image_url.includes('placehold.co') : true}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] z-20 pointer-events-none" />
              
              {/* Glass Testimonial Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-8 left-6 right-6 md:left-8 md:right-8 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl z-20 transform transition-transform duration-500 group-hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] pointer-events-none" />
                <p className="text-lg md:text-xl italic font-serif leading-relaxed opacity-95 drop-shadow-md">
                  &ldquo;The journey was as peaceful as the destination. A truly premium spiritual experience.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-primary/40 rounded-full blur-md animate-pulse" />
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center relative z-10">
                      <User size={20} className="text-white drop-shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-white tracking-wide">Rahul Sharma</p>
                    <p className="text-xs text-white/70 uppercase tracking-widest mt-0.5">Recent Pilgrim</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text Side - Glass Content Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2"
          >
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] relative overflow-hidden">
              {/* Inner subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Elevate Your <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF6A] to-[#FDEBD3]">Spiritual Experience</span>
                </h2>
                
                <p className="text-lg text-white/80 leading-relaxed font-light mb-10 drop-shadow-sm">
                  We believe your pilgrimage should be free from logistical worries. 
                  Immerse yourself in devotion while we provide a luxury, seamless travel experience 
                  tailored to your highest spiritual needs.
                </p>
                
                {/* Glass Benefit Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {benefits.map((benefit, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (0.1 * idx), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 cursor-default"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent-primary/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative w-10 h-10 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-accent-secondary group-hover:text-accent-primary group-hover:scale-110 transition-all duration-300">
                          <CheckCircle2 size={18} strokeWidth={2} className="drop-shadow-sm" />
                        </div>
                      </div>
                      <span className="text-white/90 font-medium text-sm md:text-base group-hover:text-white transition-colors">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Premium CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link 
                    href="/booking" 
                    className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-ink bg-gradient-to-r from-[#D4AF6A] to-[#FDEBD3] rounded-full overflow-hidden shadow-[0_10px_20px_-10px_rgba(212,175,106,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(212,175,106,0.6)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <span className="relative flex items-center gap-3 tracking-wide">
                      Plan Your Premium Trip 
                      <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
