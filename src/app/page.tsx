import { HeroCanvas } from "@/components/HeroCanvas";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { Metadata } from "next";

import { JourneyOverview } from "@/components/home/JourneyOverview";
import { SpiritualExperience } from "@/components/home/SpiritualExperience";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PremiumStatistics } from "@/components/home/PremiumStatistics";
import { FleetShowcase } from "@/components/home/FleetShowcase";
import { BookingProcess } from "@/components/home/BookingProcess";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustSection } from "@/components/home/TrustSection";
import { FAQPreview } from "@/components/home/FAQPreview";
import { CTASection } from "@/components/home/CTASection";
import { GlobalPreloader } from "@/components/GlobalPreloader";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jyotirling Connect | Premium Pilgrimage Travel",
    description:
      "Book premium devotional travel between Mahakaleshwar (Ujjain) and Omkareshwar Jyotirlinga. Verified drivers, comfortable vehicles, and a divine experience.",
    url: "/",
  },
};

export default function Home() {
  return (
    <GlobalPreloader>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col w-full overflow-x-hidden bg-[var(--bg)]">
        {/* Scroll Scrub Hero Canvas (UNTOUCHED) */}
        <HeroCanvas />

        {/* Premium Journey Section */}
        <JourneyOverview />

        {/* Split Layout Spiritual Experience */}
        <SpiritualExperience />

        {/* Why Choose Us with Hover Glowing Cards */}
        <WhyChooseUs />

        {/* Animated Statistics */}
        <PremiumStatistics />

        {/* Premium Fleet */}
        <FleetShowcase />

        {/* Booking Timeline */}
        <BookingProcess />

        {/* Embla Carousel Testimonials */}
        <Testimonials />

        {/* Trust Badges */}
        <TrustSection />

        {/* FAQ Accordions */}
        <FAQPreview />

        {/* Large Parallax CTA */}
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </GlobalPreloader>
  );
}
