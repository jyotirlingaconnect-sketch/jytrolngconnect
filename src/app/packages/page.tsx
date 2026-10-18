import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { JsonLd, absoluteUrl, breadcrumbJsonLd } from "@/lib/jsonLd";
import {
  bookingHref,
  coverImage,
  formatInr,
  getAvailablePackages,
  packagePath,
  vehiclePrice,
} from "@/lib/packages";

export const metadata = {
  title: "Ujjain, Omkareshwar & Maheshwar Tour Packages",
  description:
    "Private taxi tour packages from Ujjain: Omkareshwar Jyotirlinga day trip, Maheshwar, Indore, and a 3-day Omkareshwar–Mandu–Maheshwar circuit. Per-vehicle prices.",
  alternates: { canonical: "/packages" },
};

export const revalidate = 60;

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916268032441";

export default async function PackagesPage() {
  const packages = await getAvailablePackages();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jyotirling Connect tour packages",
    itemListElement: packages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(packagePath(pkg)),
      name: pkg.title,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Packages", path: "/packages" },
          ]),
          itemListJsonLd,
        ]}
      />
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Ujjain, Omkareshwar &amp; Maheshwar Tour Packages
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              Carefully crafted travel packages ensuring a seamless and comfortable pilgrimage.
              Every package is a private AC vehicle with driver, priced per vehicle.
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="mx-auto max-w-xl text-center flex flex-col items-center gap-4">
              <p className="text-lg text-ink-muted">
                We&apos;re updating our packages. Call or WhatsApp us and we&apos;ll plan a custom yatra for your group.
              </p>
              <Button asChild>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  Plan a custom package on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => {
                const image = coverImage(pkg);
                const price = vehiclePrice(pkg);
                return (
                  <Card key={pkg.id} interactive className="flex flex-col h-full overflow-hidden">
                    <Link
                      href={packagePath(pkg)}
                      className="relative block h-48 w-full bg-surface border-b border-border"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {image ? (
                        <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
                    </Link>
                    <CardContent className="pt-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-display font-bold text-ink mb-2">
                        <Link href={packagePath(pkg)} className="hover:text-accent-primary transition-colors">
                          {pkg.title}
                        </Link>
                      </h2>
                      <div className="flex items-baseline gap-1.5 mb-6">
                        {price ? (
                          <>
                            <span className="text-sm font-medium text-ink-muted">Starting from</span>
                            <span className="text-2xl font-bold text-accent-primary tabular-nums">{formatInr(price)}</span>
                            <span className="text-sm text-ink-muted">per vehicle</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-ink-muted">Price on request</span>
                        )}
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

                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={packagePath(pkg)}>View details</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href={bookingHref(pkg)}>Book Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
