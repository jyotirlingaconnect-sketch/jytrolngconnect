"use client";

import { motion } from "framer-motion";
import { Language } from "@/data/history-data";

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-40">
      <div className="flex items-center bg-surface/80 backdrop-blur-md p-1 rounded-full shadow-lg border border-border/50">
        <button
          onClick={() => setLanguage("en")}
          className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
            language === "en" ? "text-white" : "text-ink-muted hover:text-ink"
          }`}
        >
          {language === "en" && (
            <motion.div
              layoutId="lang-active"
              className="absolute inset-0 bg-accent-primary rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10">English</span>
        </button>

        <button
          onClick={() => setLanguage("hi")}
          className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
            language === "hi" ? "text-white" : "text-ink-muted hover:text-ink"
          }`}
        >
          {language === "hi" && (
            <motion.div
              layoutId="lang-active"
              className="absolute inset-0 bg-accent-primary rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10 font-sans">हिन्दी</span>
        </button>
      </div>
    </div>
  );
}
