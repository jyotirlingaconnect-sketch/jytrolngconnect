"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay so it pops in after initial render
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916268032441";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=Hari%20Om!%20I%20would%20like%20to%20enquire%20about%20your%20services.`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      aria-label="Chat on WhatsApp"
    >
      <img
        src="/whatsapp-loop.svg"
        alt="WhatsApp Logo"
        className="h-full w-full object-contain"
      />
    </a>
  );
}
