import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Heart, Map } from "lucide-react";

export const metadata = {
  title: "Why Us | Jyotirling Connect",
  description: "Learn why Jyotirling Connect is the most trusted travel agency for the Mahakaleshwar to Omkareshwar Jyotirlinga yatra.",
};

export default function WhyUsPage() {
  const reasons = [
    {
      icon: Shield,
      title: "Trusted Safety",
      desc: "Our vehicles are regularly maintained, sanitized, and driven by background-verified drivers with extensive experience on the Ujjain-Omkareshwar route. We prioritize your family's safety above all.",
    },
    {
      icon: Clock,
      title: "On-Time Service",
      desc: "Pilgrimages require strict adherence to timing for Aarti and Darshan. We guarantee punctuality so you never miss a divine moment.",
    },
    {
      icon: Heart,
      title: "Devotional Hospitality",
      desc: "Following the principle of 'Atithi Devo Bhava', we treat every pilgrim with utmost respect, ensuring your journey is as spiritually fulfilling as the destination.",
    },
    {
      icon: Map,
      title: "Local Expertise",
      desc: "Our drivers are locals who know the best routes, rest stops, and times to visit temples, offering you a seamless and guided experience.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Why Travel With Us?
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              We understand that a Jyotirlinga Yatra is not just a trip, but a spiritual milestone. 
              Here is why thousands of devotees choose Jyotirling Connect for their journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, idx) => (
              <Card key={idx} className="h-full">
                <CardContent className="pt-8 flex flex-col items-start text-left">
                  <div className="w-14 h-14 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-6">
                    <reason.icon size={28} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-ink mb-3">{reason.title}</h3>
                  <p className="text-ink-muted leading-relaxed">
                    {reason.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
