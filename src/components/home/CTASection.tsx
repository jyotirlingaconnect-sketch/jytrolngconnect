"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image with Parallax effect feeling */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Journey"
          fill
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0 bg-ink/80 backdrop-blur-[2px]" />
      </div>

      {/* Floating lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-16 text-center shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Ready to Begin Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF6A] to-[#FDEBD3]">Spiritual Journey?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Book your premium ride today and let us take care of your comfort while you focus on devotion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/booking"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-ink font-bold rounded-full overflow-hidden w-full sm:w-auto hover:scale-105 transition-transform shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-surface to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <Calendar size={20} className="relative z-10 text-accent-primary" />
              <span className="relative z-10">Book Online Now</span>
            </Link>

            <a 
              href="tel:+919876543210"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 hover:border-white transition-all w-full sm:w-auto"
            >
              <Phone size={20} className="group-hover:animate-bounce" />
              <span>Call +91 98765 43210</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
