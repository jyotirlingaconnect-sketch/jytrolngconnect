"use client";

import { motion } from "framer-motion";
import { Car, CheckSquare, MapPin, Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose Vehicle",
    description: "Select from our premium fleet based on your group size and comfort preferences.",
    icon: Car,
  },
  {
    id: 2,
    title: "Confirm Booking",
    description: "Secure your reservation instantly with our hassle-free booking process.",
    icon: CheckSquare,
  },
  {
    id: 3,
    title: "Pickup",
    description: "Our verified chauffeur arrives at your specified location exactly on time.",
    icon: MapPin,
  },
  {
    id: 4,
    title: "Temple Journey",
    description: "Experience a peaceful, divine journey from Mahakaleshwar to Omkareshwar.",
    icon: Sparkles,
  },
];

export function BookingProcess() {
  return (
    <section className="py-24 bg-section-bg transition-colors duration-700 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-ink mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-ink-muted"
          >
            Four simple steps to begin your divine pilgrimage with supreme comfort.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line Desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border/50">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Connector Line Mobile */}
                {index !== steps.length - 1 && (
                  <div className="lg:hidden absolute top-24 bottom-[-3rem] left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-accent-primary to-transparent opacity-30" />
                )}

                <div className="relative w-24 h-24 mb-6 z-10">
                  <div className="absolute inset-0 bg-accent-primary/10 rounded-full scale-150 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-full h-full bg-bg border border-border rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-accent-primary group-hover:shadow-accent-primary/20 transition-all duration-300">
                    <step.icon size={32} className="text-accent-primary" />
                    
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-secondary text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-surface">
                      {step.id}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
