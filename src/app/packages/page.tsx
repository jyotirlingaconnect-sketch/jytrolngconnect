import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Clock, MapPin, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Packages | Jyotirling Connect",
  description: "Browse our travel packages for Jyotirlinga Yatra.",
};

export const revalidate = 60;

export default async function PackagesPage() {
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  // Dummy fallback data if empty
  const items = (packages && packages.length > 0) ? packages : [
    {
      id: "1",
      title: "One-Way Ujjain to Omkareshwar",
      route: "Ujjain → Omkareshwar",
      duration: "4 Hours",
      distance: "~140 km",
      vehicle_type: "Sedan",
      price: 2500,
      is_popular: true,
      images: ["https://placehold.co/600x400/FFE5B4/A63A1E?text=Ujjain+to+Omkareshwar"],
    },
    {
      id: "2",
      title: "Round Trip Same Day Yatra",
      route: "Ujjain ↔ Omkareshwar",
      duration: "10-12 Hours",
      distance: "~280 km",
      vehicle_type: "SUV",
      price: 4500,
      is_popular: false,
      images: ["https://placehold.co/600x400/FFE5B4/A63A1E?text=Round+Trip"],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Our Packages
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              Carefully crafted travel packages ensuring a seamless and comfortable pilgrimage. 
              Find the one that best suits your schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((pkg) => (
              <Card key={pkg.id} interactive className="flex flex-col h-full overflow-hidden">
                <div className="relative h-48 w-full bg-surface border-b border-border">
                  {pkg.cover_image || (pkg.images && pkg.images[0]) ? (
                    <Image src={pkg.cover_image || pkg.images[0]} alt={pkg.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent-primary/10">
                      <span className="text-accent-primary">No Image</span>
                    </div>
                  )}
                  {pkg.is_popular && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="success">Most Popular</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="pt-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-display font-bold text-ink mb-2">{pkg.title}</h3>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-sm font-medium text-ink-muted">Starting from</span>
                    <span className="text-2xl font-bold text-accent-primary">₹{pkg.price}</span>
                  </div>

                  <div className="space-y-3 mb-8 flex-grow">
                    {pkg.route && (
                      <div className="flex items-start gap-3 text-sm text-ink-muted">
                        <MapPin size={18} className="text-accent-primary shrink-0" />
                        <span>{pkg.route}</span>
                      </div>
                    )}
                    {pkg.duration && (
                      <div className="flex items-start gap-3 text-sm text-ink-muted">
                        <Clock size={18} className="text-accent-primary shrink-0" />
                        <span>{pkg.duration}</span>
                      </div>
                    )}
                    {pkg.vehicle_type && (
                      <div className="flex items-start gap-3 text-sm text-ink-muted">
                        <Car size={18} className="text-accent-primary shrink-0" />
                        <span>{pkg.vehicle_type}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mt-auto">
                    <Button asChild className="w-full">
                      <Link href={`/booking?package=${encodeURIComponent(pkg.title)}&vehicle=${encodeURIComponent(pkg.vehicle_type || "")}`}>
                        Book Now
                      </Link>
                    </Button>
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
