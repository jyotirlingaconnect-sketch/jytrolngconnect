"use client";

import { useState } from "react";
import { Language, historyDestinations } from "@/data/history-data";
import { LanguageToggle } from "@/components/history/LanguageToggle";
import { HistoryHero } from "@/components/history/HistoryHero";
import { DestinationCard } from "@/components/history/DestinationCard";
import { motion } from "framer-motion";

export function HistoryClient() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div className={`min-h-screen bg-bg transition-colors duration-300 ${language === "hi" ? "font-sans" : ""}`}>
      {/* Language Toggle */}
      <LanguageToggle language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      <HistoryHero language={language} />

      {/* Destinations Container */}
      <section id="destinations" className="container mx-auto px-4 md:px-6 pb-24">
        {/* Subtle separator */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          className="w-24 h-1 bg-accent-primary mx-auto rounded-full mb-16"
        />

        <div className="flex flex-col">
          {historyDestinations.map((destination, index) => (
            <DestinationCard 
              key={destination.id} 
              destination={destination} 
              language={language} 
              index={index} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}
