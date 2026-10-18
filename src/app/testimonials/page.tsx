import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

export const metadata = {
  title: "Pilgrim Reviews & Testimonials",
  description: "Read what our pilgrims say about their Jyotirlinga Yatra experience with us.",
  alternates: { canonical: "/testimonials" },
};

export const revalidate = 60;

export default async function TestimonialsPage() {
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .or("status.eq.approved,is_approved.eq.true")
    .order("created_at", { ascending: false });

  const items = testimonials ?? [];

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Pilgrim Experiences
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              We take pride in serving thousands of devotees every year. Here are some of their experiences with Jyotirling Connect.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center max-w-xl mx-auto py-16 px-6 rounded-3xl border border-border bg-surface">
              <h2 className="text-2xl font-display font-bold text-ink mb-3">
                Be the first to share your experience
              </h2>
              <p className="text-ink-muted mb-8">
                Travelled with us? Your story helps other pilgrims plan their journey.
              </p>
              <Link
                href="/share/testimonial"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-accent-primary text-white font-semibold hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Share your experience
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((testimonial) => (
              <Card key={testimonial.id} className="h-full flex flex-col">
                <CardContent className="pt-8 flex flex-col h-full">
                  <div className="flex text-accent-secondary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < (testimonial.overall_rating || testimonial.rating || 5) ? "fill-current" : "text-border fill-transparent"}
                      />
                    ))}
                  </div>
                  <p className="text-ink italic leading-relaxed mb-8 flex-grow">
                    &ldquo;{testimonial.experience || testimonial.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-sm">{testimonial.name}</h4>
                      {(testimonial.city || testimonial.location) && (
                        <p className="text-xs text-ink-muted">{testimonial.city || testimonial.location}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
