"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ContactInfo {
  phone_numbers?: string[];
  email?: string;
  address?: string;
}

export function GlassCTA() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    async function fetchContactData() {
      const { data: contact } = await supabase.from("contact_info").select("*").limit(1).single();
      if (contact) setContactInfo(contact);
    }
    fetchContactData();
  }, []);

  const phone = contactInfo?.phone_numbers?.[0] || "+91 98765 43210";

  return (
    <div className="container mx-auto px-4 md:px-6 relative z-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // visionOS-like spring
        className="max-w-[900px] mx-auto overflow-hidden relative rounded-[2.5rem] p-[1px]"
      >
        {/* Subtle animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-white/20 z-0 rounded-[2.5rem]" />
        
        {/* Inner Card (Glass) */}
        <div className="relative z-10 bg-white/5 backdrop-blur-2xl rounded-[2.4rem] p-8 md:p-12 lg:p-16 text-center shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] h-full w-full">
          
          {/* Subtle noise texture or highlight for premium feel (optional, using CSS gradient here) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-[2.4rem] pointer-events-none" />
          
          <div className="relative z-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight drop-shadow-xl tracking-tight">
              Ready to Begin Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D08B] via-[#FDEBD3] to-[#D4AF6A]">
                Spiritual Journey?
              </span>
            </h2>

            <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide drop-shadow-md">
              Book your premium ride today and let us take care of your comfort while you focus entirely on your devotion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Primary Button */}
              <Link
                href="/booking"
                className="group relative flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-[#D4AF6A] to-[#F5D08B] text-ink font-bold rounded-full overflow-hidden w-full sm:w-auto shadow-[0_0_30px_rgba(212,175,106,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,106,0.5)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 tracking-wide uppercase text-sm">Book Online Now</span>
                <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary Button */}
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full w-full sm:w-auto transition-all hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-lg"
              >
                <Phone size={18} className="transition-transform group-hover:animate-pulse" />
                <span className="tracking-wide uppercase text-sm">Call {phone}</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
