"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DestinationContent, Language } from "@/data/history-data";

interface DestinationCardProps {
  destination: DestinationContent;
  language: Language;
  index: number;
}

export function DestinationCard({ destination, language, index }: DestinationCardProps) {
  const content = destination[language];
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-16 md:py-24 border-b border-border/50 last:border-0"
    >
      <div className={`flex flex-col gap-12 lg:gap-16 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
        
        {/* Image Section */}
        <div className="lg:w-5/12 shrink-0 relative group">
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={destination.image}
              alt={content.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized
            />
            {/* Elegant glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 pr-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-md">
                {content.name}
              </h2>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -inset-4 border border-accent-primary/20 rounded-3xl -z-10 transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>

        {/* Content Section */}
        <div className="lg:w-7/12 flex flex-col justify-center space-y-8">
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl md:text-2xl font-medium text-ink leading-relaxed">
              {content.overview}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-accent-primary uppercase tracking-wider">
                {language === "en" ? "Historical Background" : "ऐतिहासिक पृष्ठभूमि"}
              </h3>
              <p className="text-ink-muted leading-relaxed">
                {content.history}
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-accent-primary uppercase tracking-wider">
                {language === "en" ? "Mythology & Beliefs" : "पौराणिक कथाएँ और मान्यताएँ"}
              </h3>
              <p className="text-ink-muted leading-relaxed">
                {content.mythology}
              </p>
            </div>
          </div>

          <div className="bg-surface/50 p-6 rounded-2xl border border-border/50">
            <h3 className="text-lg font-semibold text-ink mb-3">
              {language === "en" ? "Architecture" : "वास्तुकला"}
            </h3>
            <p className="text-ink-muted leading-relaxed">
              {content.architecture}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {content.facts.map((fact, idx) => (
              <div key={idx} className="bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-border/50 p-4 rounded-xl flex flex-col items-center text-center justify-center transition-all hover:bg-surface hover:shadow-md">
                <span className="text-xs uppercase tracking-wider text-accent-secondary mb-1">
                  {fact.label}
                </span>
                <span className="font-medium text-ink">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>

          {/* Visitor Info */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
            <div className="inline-flex items-center text-sm font-medium text-ink bg-surface px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-success mr-2" />
              {language === "en" ? "Best Time: " : "सबसे अच्छा समय: "}{content.visitorInfo.bestTime}
            </div>
            <div className="inline-flex items-center text-sm font-medium text-ink bg-surface px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-warning mr-2" />
              {content.visitorInfo.timings}
            </div>
            {content.visitorInfo.dressCode && (
              <div className="inline-flex items-center text-sm font-medium text-ink bg-surface px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-info mr-2" />
                {content.visitorInfo.dressCode}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
