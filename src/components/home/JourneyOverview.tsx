"use client";

import { motion } from "framer-motion";
import { Sparkles, MapPin, Navigation, Map } from "lucide-react";

export function JourneyOverview() {
  const steps = [
    {
      id: 1,
      title: "Mahakaleshwar",
      subtitle: "Ujjain, The City of Time",
      icon: MapPin,
      time: "Start",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: 2,
      title: "Premium Journey",
      subtitle: "Comfortable scenic drive",
      icon: Navigation,
      time: "2.5 Hrs",
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 3,
      title: "Omkareshwar",
      subtitle: "Island of Devotion",
      icon: Map,
      time: "Arrival",
      color: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-transparent relative z-20">
      {/* Subtle floating light effects (very low opacity so hero animation shines through) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Glass Heading Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto mb-10 md:mb-14 p-5 md:p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-center relative overflow-hidden"
        >
          {/* Subtle inner glow for the heading card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full mb-5 md:mb-6 shadow-xl cursor-default"
          >
            <Sparkles className="w-4 h-4 text-accent-secondary animate-pulse" />
            <span className="text-xs md:text-sm font-semibold text-white uppercase tracking-[0.25em] drop-shadow-md">The Sacred Route</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-5 md:mb-6 drop-shadow-2xl leading-tight">
            A Journey Beyond <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF6A] to-[#FDEBD3]">Distance</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto font-light drop-shadow-md">
            Experience the divine energy connecting two of the most revered Jyotirlingas. 
            Our premium fleet ensures your focus remains purely on devotion, while we handle the road.
          </p>
        </motion.div>

        {/* Timeline Area */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glowing Animated Connector Line Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 -translate-y-1/2 rounded-full overflow-hidden bg-white/10">
            <motion.div 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Glowing Animated Connector Line Mobile */}
          <div className="md:hidden absolute left-12 top-[10%] bottom-[10%] w-1 rounded-full overflow-hidden bg-white/10">
            <motion.div 
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#D4AF6A] to-transparent"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative flex md:flex-col items-center md:text-center gap-4 md:gap-6 p-5 md:p-7 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)]"
              >
                {/* Floating Glass Icon */}
                <div className="relative">
                  {/* Outer animated glow */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${step.color} rounded-full blur-2xl opacity-20 group-hover:opacity-60 group-hover:scale-150 transition-all duration-500`} />
                  
                  {/* Icon container */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-black/20 backdrop-blur-2xl border border-white/20 shadow-inner rounded-full flex items-center justify-center z-10 group-hover:border-white/40 transition-colors duration-300">
                    <step.icon strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="flex-1 md:mt-8 w-full flex flex-col items-start md:items-center">
                  <div className="inline-block px-3 py-1 bg-black/30 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-sm group-hover:bg-black/40 transition-colors duration-300">
                    {step.time}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-2 drop-shadow-md">{step.title}</h3>
                  <p className="text-white/80 font-light leading-relaxed text-sm">{step.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
