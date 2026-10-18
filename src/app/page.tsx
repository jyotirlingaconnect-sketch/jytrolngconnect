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
import { homeFaqs } from "@/lib/faqs";
import { JsonLd, businessJsonLd, faqJsonLd, websiteJsonLd } from "@/lib/jsonLd";

const homeTitle = "Ujjain to Omkareshwar Taxi & Jyotirlinga Tour Packages | Jyotirling Connect";
const homeDescription =
  "Private AC taxi, Innova Crysta and tempo traveller from Ujjain to Omkareshwar, Maheshwar, Mandu and Indore. Jyotirlinga day trips and tour packages with per-vehicle prices.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
};

export default function Home() {
  return (
    <GlobalPreloader>
      <JsonLd data={[businessJsonLd, websiteJsonLd, faqJsonLd(homeFaqs)]} />
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
