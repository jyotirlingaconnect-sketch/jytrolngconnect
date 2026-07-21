"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is the vehicle private or shared?",
    answer: "All our bookings are for private vehicles. You and your family will have the entire vehicle to yourselves for maximum comfort and privacy."
  },
  {
    question: "Are toll and parking charges included?",
    answer: "Yes, our premium packages include all toll taxes, state taxes, and parking fees. There are absolutely no hidden charges during your journey."
  },
  {
    question: "Can we request stops during the journey?",
    answer: "Absolutely. Your comfort is our priority. You can request reasonable stops for food, tea, or rest during the journey without any extra charges."
  },
  {
    question: "How do you ensure vehicle hygiene?",
    answer: "Every vehicle undergoes a deep cleaning and sanitization process before each trip. Our drivers also maintain strict hygiene standards throughout the journey."
  }
];

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-20 bg-section-bg transition-colors duration-700 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-ink mb-4"
          >
            Common Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? "bg-bg border-accent-secondary/50 shadow-lg" 
                  : "bg-surface border-border hover:border-accent-secondary/30"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-inset"
              >
                <span className="font-bold text-ink text-base md:text-lg pr-6 md:pr-8">{faq.question}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  openIndex === index ? "bg-accent-primary text-white" : "bg-border text-ink-muted"
                }`}>
                  {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-4 pt-0 md:p-6 md:pt-0 text-ink-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/faq" className="text-accent-primary font-bold hover:underline inline-flex items-center gap-2">
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}
