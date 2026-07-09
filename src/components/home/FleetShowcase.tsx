"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Snowflake, Briefcase, ArrowRight } from "lucide-react";

const fleet = [
  {
    id: "sedan",
    name: "Premium Sedan",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop",
    capacity: "4 Seats",
    ac: "AC",
    luggage: "2 Bags",
    price: "₹3,500",
    popular: false,
  },
  {
    id: "suv",
    name: "Luxury SUV",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1000&auto=format&fit=crop",
    capacity: "6-7 Seats",
    ac: "Dual AC",
    luggage: "4 Bags",
    price: "₹5,000",
    popular: true,
  },
  {
    id: "traveller",
    name: "Tempo Traveller",
    image: "https://images.unsplash.com/photo-1634842183296-6e2eeaa72504?q=80&w=1000&auto=format&fit=crop",
    capacity: "12-17 Seats",
    ac: "AC",
    luggage: "Large",
    price: "₹8,500",
    popular: false,
  }
];

export function FleetShowcase() {
  return (
    <section className="py-24 bg-section-bg transition-colors duration-700 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-ink mb-6"
          >
            Our Premium Fleet
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-ink-muted"
          >
            Travel in supreme comfort. Our vehicles are meticulously maintained and sanitized for a luxurious journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group relative bg-bg rounded-3xl overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              {vehicle.popular && (
                <div className="absolute top-4 right-4 z-20 bg-accent-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="relative w-full h-64 overflow-hidden bg-black/5">
                <Image 
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                {/* Gradient overlay to make text pop if any */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-ink mb-4">{vehicle.name}</h3>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                    <Users size={16} className="text-accent-secondary" />
                    {vehicle.capacity}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                    <Snowflake size={16} className="text-accent-secondary" />
                    {vehicle.ac}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-ink-muted bg-surface px-3 py-1.5 rounded-lg border border-border/50">
                    <Briefcase size={16} className="text-accent-secondary" />
                    {vehicle.luggage}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
                  <div>
                    <p className="text-xs text-ink-muted mb-1">Starting from</p>
                    <p className="text-xl font-bold text-accent-primary">{vehicle.price}</p>
                  </div>
                  
                  <Link 
                    href="/booking"
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface text-ink hover:bg-accent-primary hover:text-white transition-colors shadow-sm"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
