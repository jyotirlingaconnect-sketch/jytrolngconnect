"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Map, Clock, BadgeCheck } from "lucide-react";

export function TrustSection() {
  const badges = [
    { icon: ShieldCheck, label: "100% Secure Payment" },
    { icon: Map, label: "Live GPS Tracking" },
    { icon: Clock, label: "24/7 Support" },
    { icon: BadgeCheck, label: "Govt Approved" },
  ];

  return (
    <section className="py-12 bg-white/5 border-y border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <badge.icon className="w-8 h-8 text-accent-secondary" />
              <span className="font-bold text-ink text-sm md:text-base uppercase tracking-wider">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
