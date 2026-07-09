"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/LottieAnimation";
import { CalendarCheck, CreditCard, RotateCcw, Star, Map, Car, UserCheck, Clock, Shield, PhoneCall, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TermsClientProps {
  contactInfo: {
    phone_numbers?: string[];
    email?: string;
    address?: string;
    business_hours?: string;
  } | null;
}

const termsContent = {
  en: {
    heroBadge: "Legal Information",
    heroTitle: "Terms & Conditions",
    heroSubtext: "Please read these terms carefully before booking your pilgrimage journey with Jyotirling Connect.",
    notice: "By booking with Jyotirling Connect, you agree to these Terms & Conditions.",
    sections: [
      {
        id: "booking",
        title: "1. Booking Policy",
        content: "To secure your booking, an advance payment is required. Your booking is only confirmed once you receive a confirmation email or message from our team. All packages are subject to availability.",
        lottie: "booking.json",
        icon: CalendarCheck
      },
      {
        id: "payment",
        title: "2. Payment Policy",
        content: "An advance payment is mandatory for all reservations. The remaining balance must be paid before or upon arrival according to the package terms. We accept UPI, bank transfers, and major credit/debit cards.",
        lottie: "payment.json",
        icon: CreditCard
      },
      {
        id: "cancellation",
        title: "3. Cancellation & Refund",
        content: "Cancellations made within 48 hours of the journey are generally non-refundable. For earlier cancellations, refund eligibility depends on the specific package and hotel policies. Refunds are processed within 7-10 business days.",
        lottie: "refund.json",
        icon: RotateCcw
      },
      {
        id: "vip",
        title: "4. VIP Darshan",
        content: "Jyotirling Connect assists with VIP Darshan arrangements for your convenience. However, the final approval and timings are completely controlled by the temple administration. We do not guarantee access during unexpected temple closures.",
        lottie: "temple.json",
        icon: Star
      },
      {
        id: "responsibility",
        title: "5. Travel Responsibility",
        content: "We guarantee timely pickups and professional drivers. However, we expect passengers to be ready at the scheduled time to avoid delays. Any extra waiting time or detours may incur additional charges.",
        lottie: "travel.json",
        icon: Map
      },
      {
        id: "vehicle",
        title: "6. Vehicle Rules",
        content: "Smoking and consumption of alcohol are strictly prohibited inside the vehicles. Please keep the vehicle clean and follow safety instructions provided by the driver. We aim to keep a pure and spiritual environment.",
        lottie: "luxury-car.json",
        icon: Car
      },
      {
        id: "customer",
        title: "7. Customer Responsibilities",
        content: "Customers must provide accurate contact and passenger information during booking. Please carry valid government ID proofs at all times and strictly adhere to the temple dress codes and regulations.",
        lottie: "customer-service.json",
        icon: UserCheck
      },
      {
        id: "delays",
        title: "8. Delays",
        content: "While we strive for punctuality, schedules may be affected by traffic, severe weather, heavy temple crowds, road conditions, or other unexpected situations beyond our control.",
        lottie: "clock.json",
        icon: Clock
      },
      {
        id: "privacy",
        title: "9. Privacy Policy",
        content: "Your personal information is kept strictly confidential. We never sell or share your data with third parties. Your details are used exclusively for booking and communication purposes regarding your journey.",
        lottie: "shield.json",
        icon: Shield
      },
      {
        id: "contact",
        title: "10. Contact Us",
        content: "For any questions regarding these terms, please contact our support team.",
        lottie: "support.json",
        icon: PhoneCall
      }
    ]
  },
  hi: {
    heroBadge: "कानूनी जानकारी",
    heroTitle: "नियम और शर्तें",
    heroSubtext: "ज्योतिर्लिंग कनेक्ट के साथ अपनी तीर्थ यात्रा बुक करने से पहले कृपया इन नियमों को ध्यान से पढ़ें।",
    notice: "ज्योतिर्लिंग कनेक्ट के साथ बुकिंग करके, आप इन नियमों और शर्तों से सहमत होते हैं।",
    sections: [
      {
        id: "booking",
        title: "1. बुकिंग नीति",
        content: "अपनी बुकिंग सुरक्षित करने के लिए, अग्रिम भुगतान (एडवांस) आवश्यक है। आपकी बुकिंग केवल तभी कन्फर्म मानी जाती है जब आपको हमारी टीम से पुष्टिकरण ईमेल या संदेश प्राप्त होता है। सभी पैकेज उपलब्धता के अधीन हैं।",
        lottie: "booking.json",
        icon: CalendarCheck
      },
      {
        id: "payment",
        title: "2. भुगतान नीति",
        content: "सभी आरक्षणों के लिए अग्रिम भुगतान अनिवार्य है। शेष राशि का भुगतान पैकेज की शर्तों के अनुसार आगमन से पहले या आगमन पर किया जाना चाहिए। हम यूपीआई (UPI), बैंक ट्रांसफर और प्रमुख क्रेडिट/डेबिट कार्ड स्वीकार करते हैं।",
        lottie: "payment.json",
        icon: CreditCard
      },
      {
        id: "cancellation",
        title: "3. रद्दीकरण और धनवापसी (Cancellation & Refund)",
        content: "यात्रा के 48 घंटे के भीतर किए गए रद्दीकरण पर आम तौर पर कोई रिफंड नहीं दिया जाता है। उससे पहले रद्दीकरण के लिए, रिफंड की पात्रता विशिष्ट पैकेज और होटल की नीतियों पर निर्भर करती है। रिफंड 7-10 कार्य दिवसों के भीतर संसाधित किए जाते हैं।",
        lottie: "refund.json",
        icon: RotateCcw
      },
      {
        id: "vip",
        title: "4. वीआईपी दर्शन",
        content: "ज्योतिर्लिंग कनेक्ट आपकी सुविधा के लिए वीआईपी दर्शन की व्यवस्था में सहायता करता है। हालाँकि, अंतिम स्वीकृति और समय पूरी तरह से मंदिर प्रशासन द्वारा नियंत्रित होते हैं। हम मंदिर के अचानक बंद होने के दौरान प्रवेश की गारंटी नहीं देते हैं।",
        lottie: "temple.json",
        icon: Star
      },
      {
        id: "responsibility",
        title: "5. यात्रा की जिम्मेदारी",
        content: "हम समय पर पिकअप और पेशेवर ड्राइवरों की गारंटी देते हैं। हालाँकि, हम उम्मीद करते हैं कि यात्री देरी से बचने के लिए निर्धारित समय पर तैयार रहेंगे। अतिरिक्त प्रतीक्षा समय या मार्ग में बदलाव पर अतिरिक्त शुल्क लग सकता है।",
        lottie: "travel.json",
        icon: Map
      },
      {
        id: "vehicle",
        title: "6. वाहन के नियम",
        content: "वाहनों के अंदर धूम्रपान और शराब का सेवन सख्त वर्जित है। कृपया वाहन को साफ रखें और ड्राइवर द्वारा दिए गए सुरक्षा निर्देशों का पालन करें। हमारा उद्देश्य एक शुद्ध और आध्यात्मिक वातावरण बनाए रखना है।",
        lottie: "luxury-car.json",
        icon: Car
      },
      {
        id: "customer",
        title: "7. ग्राहक की जिम्मेदारियां",
        content: "बुकिंग के दौरान ग्राहकों को सटीक संपर्क और यात्री जानकारी प्रदान करनी चाहिए। कृपया हर समय वैध सरकारी आईडी प्रमाण साथ रखें और मंदिर के ड्रेस कोड और नियमों का कड़ाई से पालन करें।",
        lottie: "customer-service.json",
        icon: UserCheck
      },
      {
        id: "delays",
        title: "8. विलंब / देरी",
        content: "हालांकि हम समय की पाबंदी के लिए प्रयास करते हैं, लेकिन यातायात, खराब मौसम, मंदिर में भारी भीड़, सड़क की स्थिति, या हमारे नियंत्रण से बाहर की अन्य अप्रत्याशित स्थितियों के कारण कार्यक्रम प्रभावित हो सकते हैं।",
        lottie: "clock.json",
        icon: Clock
      },
      {
        id: "privacy",
        title: "9. गोपनीयता (Privacy)",
        content: "आपकी व्यक्तिगत जानकारी पूरी तरह से गोपनीय रखी जाती है। हम कभी भी आपका डेटा तीसरे पक्ष को नहीं बेचते या साझा नहीं চুক্তियों के लिए किया जाता है।",
        lottie: "shield.json",
        icon: Shield
      },
      {
        id: "contact",
        title: "10. संपर्क करें",
        content: "इन शर्तों के संबंध में किसी भी प्रश्न के लिए, कृपया हमारी सहायता टीम से संपर्क करें।",
        lottie: "support.json",
        icon: PhoneCall
      }
    ]
  }
};

export default function TermsClient({ contactInfo }: TermsClientProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = termsContent[lang];

  const phone = contactInfo?.phone_numbers?.[0] || "+91 98765 43210";
  const email = contactInfo?.email || "info@jyotirlingconnect.com";
  const address = contactInfo?.address || "Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456006";
  const businessHours = contactInfo?.business_hours || "Monday - Sunday\n9:00 AM - 8:00 PM";

  return (
    <>
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bg">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-secondary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <main className="flex min-h-[100dvh] flex-col pt-24 pb-12 font-sans">
        
        {/* Header & Toggle Container */}
        <div className="container mx-auto px-4 md:px-6 max-w-4xl flex flex-row justify-between items-center gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-border/50 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span 
                key={lang}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs font-semibold text-ink-muted tracking-wide uppercase"
              >
                {t.heroBadge}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Premium Language Toggle (Compact) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center bg-surface/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full p-0.5 shadow-sm"
          >
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-300",
                lang === "en" 
                  ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-md" 
                  : "text-ink-muted hover:text-ink"
              )}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-300",
                lang === "hi" 
                  ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-md" 
                  : "text-ink-muted hover:text-ink"
              )}
              style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', 'Hind', 'Mukta', sans-serif" : "inherit" }}
            >
              हिन्दी
            </button>
          </motion.div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 max-w-4xl mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className={cn(
                    "font-display font-bold text-ink leading-tight mb-3",
                    lang === "hi" ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
                  )}>
                    {t.heroTitle}
                  </h1>
                  <p className={cn(
                    "text-ink-muted leading-relaxed max-w-md",
                    lang === "hi" ? "text-base font-medium" : "text-base"
                  )}>
                    {t.heroSubtext}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-[200px] md:h-[240px] flex items-center justify-center md:justify-end"
            >
              <div className="absolute right-4 bg-gradient-to-bl from-accent-primary/10 to-accent-secondary/5 rounded-full blur-2xl w-40 h-40" />
              <LottieAnimation path="/lottie/legal-document.json" className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] relative z-10" />
            </motion.div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="container mx-auto px-4 md:px-6 max-w-4xl space-y-4 mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {t.sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  className="group relative p-5 md:p-6 rounded-2xl bg-surface/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-primary to-accent-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center text-accent-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <section.icon size={24} />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <h2 className="text-xl md:text-2xl font-display font-semibold text-ink">
                        {section.title}
                      </h2>
                      <p className={cn(
                        "text-ink-muted leading-relaxed",
                        lang === "hi" ? "text-[15px] font-medium tracking-wide" : "text-[15px]"
                      )}>
                        {section.content}
                      </p>

                      {/* Special Contact Block if section is contact */}
                      {section.id === "contact" && (
                        <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                          <div className="flex items-center gap-2.5">
                            <PhoneCall size={16} className="text-accent-primary shrink-0" />
                            <span className="text-ink text-[15px] font-medium">{phone}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Mail size={16} className="text-accent-primary shrink-0" />
                            <span className="text-ink text-[15px] font-medium">{email}</span>
                          </div>
                          <div className="flex items-start gap-2.5 sm:col-span-2">
                            <MapPin size={16} className="text-accent-primary shrink-0 mt-0.5" />
                            <span className="text-ink text-[15px] font-medium">{address}</span>
                          </div>
                          <div className="flex items-start gap-2.5 sm:col-span-2">
                            <Clock size={16} className="text-accent-primary shrink-0 mt-0.5" />
                            <span className="text-ink text-[15px] font-medium">{businessHours.replace("\n", " | ")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Important Notice */}
        <section className="container mx-auto px-4 md:px-6 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-surface to-accent-secondary/10 border border-accent-secondary/30 shadow-sm text-center overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className={cn(
                "relative z-10 font-display font-semibold text-ink",
                lang === "hi" ? "text-lg md:text-xl" : "text-lg md:text-xl"
              )}>
                {t.notice}
              </p>
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
      <Footer />
    </>
  );
}
