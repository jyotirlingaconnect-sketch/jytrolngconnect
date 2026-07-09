"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { Language } from "@/data/history-data";

interface HistoryHeroProps {
  language: Language;
}

export function HistoryHero({ language }: HistoryHeroProps) {

  const content = {
    en: {
      badge: "Explore the Sacred Heritage",
      title: "Discover the History Behind Every Sacred Destination",
      description: "Every temple, fort, and river ghat on this sacred journey carries a unique story, rich heritage, and profound spiritual significance. Immerse yourself in the timeless tales of devotion and architecture.",
      primaryBtn: "Explore Destinations",
      secondaryBtn: "Book Your Journey"
    },
    hi: {
      badge: "पवित्र विरासत का अन्वेषण करें",
      title: "हर पवित्र स्थल के पीछे का इतिहास और रहस्य जानें",
      description: "इस पवित्र यात्रा के हर मंदिर, किले और नदी घाट की एक अनूठी कहानी, समृद्ध विरासत और गहरा आध्यात्मिक महत्व है। भक्ति और वास्तुकला की कालातीत कहानियों में खुद को डुबो दें।",
      primaryBtn: "गंतव्य देखें",
      secondaryBtn: "यात्रा बुक करें"
    }
  };

  const t = content[language];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full px-4 py-1.5 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-primary mr-2 animate-pulse" />
              {t.badge}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink leading-[1.1] mb-6">
              {t.title}
            </h1>
            
            <p className="text-lg text-ink-muted leading-relaxed mb-8">
              {t.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-accent-primary text-white"
                onClick={() => {
                  document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t.primaryBtn}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full hover:bg-surface transition-all"
                asChild
              >
                <Link href="/booking">{t.secondaryBtn}</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Glowing Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center items-center h-[300px] md:h-[500px]"
          >
            <div className="relative w-full max-w-[400px] aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-accent-primary/20" style={{ perspective: "1000px" }}>
              <img 
                src="/history/golden-om.png" 
                alt="3D Golden Om Icon" 
                className="w-full h-full object-contain p-8 animate-spin-y mix-blend-screen"
                style={{ transformStyle: "preserve-3d" }}
              />
              <div className="absolute inset-0 bg-accent-primary/20 mix-blend-overlay" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
