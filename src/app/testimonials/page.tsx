import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

export const metadata = {
  title: "Testimonials | Jyotirling Connect",
  description: "Read what our pilgrims say about their Jyotirlinga Yatra experience with us.",
};

export const revalidate = 60;

export default async function TestimonialsPage() {
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .or("status.eq.approved,is_approved.eq.true")
    .order("created_at", { ascending: false });

  const items = (testimonials && testimonials.length > 0) ? testimonials : [
    {
      id: "1",
      name: "Rajesh Sharma",
      location: "Mumbai, Maharashtra",
      message: "The journey was exceptionally smooth. Our driver was very polite and knew exactly what time we needed to reach for the Bhasma Aarti. Highly recommended for any family traveling with elders.",
      rating: 5,
    },
    {
      id: "2",
      name: "Sneha Patel",
      location: "Ahmedabad, Gujarat",
      message: "Very clean Innova and punctual service. We booked a round trip from Indore Airport to Ujjain and Omkareshwar. The whole process was transparent and stress-free.",
      rating: 5,
    },
    {
      id: "3",
      name: "Anil Kumar",
      location: "Delhi",
      message: "Atithi Devo Bhava is truly practiced here. The team was responsive on WhatsApp even late at night when our train got delayed. A divine experience made comfortable.",
      rating: 4,
    },
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((testimonial) => (
              <Card key={testimonial.id} className="h-full flex flex-col">
                <CardContent className="pt-8 flex flex-col h-full">
                  <div className="flex text-accent-secondary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < (testimonial.rating || 5) ? "fill-current" : "text-border fill-transparent"}
                      />
                    ))}
                  </div>
                  <p className="text-ink italic leading-relaxed mb-8 flex-grow">
                    &ldquo;{testimonial.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-sm">{testimonial.name}</h4>
                      {testimonial.location && (
                        <p className="text-xs text-ink-muted">{testimonial.location}</p>
                      )}
                    </div>
                  </div>
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
