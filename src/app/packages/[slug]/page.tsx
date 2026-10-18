import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Clock, MapPin, Navigation, Route, Users, XCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { packageFaqs } from "@/lib/faqs";
import {
  JsonLd,
  absoluteUrl,
  breadcrumbJsonLd,
  businessId,
  faqJsonLd,
} from "@/lib/jsonLd";
import {
  type Package,
  bookingHref,
  coverImage,
  formatInr,
  getAvailablePackages,
  getPackageBySlug,
  packagePath,
  perPersonPrice,
  vehiclePrice,
} from "@/lib/packages";

export const revalidate = 60;

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916268032441";

export async function generateStaticParams() {
  const packages = await getAvailablePackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};

  const title = (pkg.meta_title || pkg.title).replace(/\s*\|\s*Jyotirling Connect\s*$/i, "");
  const description = pkg.meta_description || pkg.description?.slice(0, 155) || undefined;

  return {
    title,
    description,
    alternates: { canonical: packagePath(pkg) },
    openGraph: { title, description, url: packagePath(pkg), type: "website" },
    twitter: { title, description },
  };
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const otherPackages = (await getAvailablePackages()).filter((other) => other.slug !== pkg.slug);
  const carPrice = vehiclePrice(pkg);
  const personPrice = perPersonPrice(pkg);
  const image = coverImage(pkg);
  const included = [...(pkg.included_facilities ?? []), ...(pkg.included_services ?? [])];
  const whatsappText = encodeURIComponent(`Hi, I'd like to book the "${pkg.title}" package.`);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/packages" },
    { name: pkg.title, path: packagePath(pkg) },
  ];

  return (
    <>
      <JsonLd
        data={[
          touristTripJsonLd(pkg, carPrice, image),
          breadcrumbJsonLd(breadcrumbs),
          faqJsonLd(packageFaqs),
        ]}
      />
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
                  {index < breadcrumbs.length - 1 ? (
                    <Link href={crumb.path} className="hover:text-accent-primary transition-colors">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-ink" aria-current="page">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 flex flex-col gap-8 min-w-0">
              <header className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight">
                  {pkg.title}
                </h1>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-ink-muted">
                  {pkg.route && <Fact icon={Route} text={pkg.route} />}
                  {pkg.duration && <Fact icon={Clock} text={pkg.duration} />}
                  {pkg.distance && <Fact icon={Navigation} text={pkg.distance} />}
                  {pkg.seating_capacity && <Fact icon={Users} text={`Up to ${pkg.seating_capacity} passengers`} />}
                </ul>
              </header>

              {image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface">
                  <Image
                    src={image}
                    alt={pkg.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              {pkg.description && (
                <p className="text-lg text-ink-muted leading-relaxed">{pkg.description}</p>
              )}

              {pkg.package_highlights && pkg.package_highlights.length > 0 && (
                <Section title="Highlights">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.package_highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-ink">
                        <CheckCircle2 size={20} className="text-accent-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {pkg.days_itinerary && pkg.days_itinerary.length > 0 && (
                <Section title="Day-by-day itinerary">
                  <ol className="flex flex-col gap-4">
                    {pkg.days_itinerary.map((day) => (
                      <li key={day.day}>
                        <Card>
                          <CardContent className="pt-6 flex flex-col gap-3">
                            <div className="flex items-baseline gap-3">
                              <span className="text-sm font-semibold uppercase tracking-wider text-accent-primary shrink-0">
                                Day {day.day}
                              </span>
                              <h3 className="text-lg font-display font-bold text-ink">{day.title}</h3>
                            </div>
                            {day.description && <p className="text-ink-muted leading-relaxed">{day.description}</p>}
                            {day.places && day.places.length > 0 && (
                              <ul className="flex flex-wrap gap-2">
                                {day.places.map((place) => (
                                  <li key={place} className="text-sm rounded-full border border-border bg-surface px-3 py-1 text-ink">
                                    {place}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {day.notes && <p className="text-sm text-ink-muted italic">{day.notes}</p>}
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              {pkg.places_to_visit && pkg.places_to_visit.length > 0 && (
                <Section title="Places you'll visit">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.places_to_visit.map((place) => (
                      <li key={place} className="flex items-start gap-3 text-ink">
                        <MapPin size={18} className="text-accent-primary shrink-0 mt-0.5" />
                        <span>{place}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {pkg.pricing_options && pkg.pricing_options.length > 0 && (
                <Section title="Price by group size">
                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface text-ink-muted">
                        <tr>
                          <th className="px-4 py-3 font-medium">Passengers</th>
                          <th className="px-4 py-3 font-medium text-right">Vehicle price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.pricing_options.map((option) => (
                          <tr key={option.persons} className="border-t border-border">
                            <td className="px-4 py-3 text-ink">Up to {option.persons}</td>
                            <td className="px-4 py-3 text-right tabular-nums text-ink">
                              {option.discount_price && option.discount_price < option.price ? (
                                <>
                                  <span className="mr-2 text-ink-muted line-through">{formatInr(option.price)}</span>
                                  <span className="font-semibold">{formatInr(option.discount_price)}</span>
                                </>
                              ) : (
                                <span className="font-semibold">{formatInr(option.price)}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}

              {(included.length > 0 || (pkg.excluded_services?.length ?? 0) > 0) && (
                <Section title="What's included">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {included.length > 0 && (
                      <ul className="flex flex-col gap-3">
                        {included.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-ink">
                            <CheckCircle2 size={18} className="text-accent-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {pkg.excluded_services && pkg.excluded_services.length > 0 && (
                      <ul className="flex flex-col gap-3">
                        {pkg.excluded_services.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-ink-muted">
                            <XCircle size={18} className="shrink-0 mt-0.5" />
                            <span>Not included: {item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Section>
              )}

              <Section title="Common questions">
                <dl className="flex flex-col gap-5">
                  {packageFaqs.map((faq) => (
                    <div key={faq.question} className="flex flex-col gap-1">
                      <dt className="font-semibold text-ink">{faq.question}</dt>
                      <dd className="text-ink-muted leading-relaxed">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            </div>

            <aside className="lg:col-span-1">
              <Card className="lg:sticky lg:top-28">
                <CardContent className="pt-6 flex flex-col gap-5">
                  {carPrice ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-ink-muted">Starting from</span>
                      <span className="text-3xl font-bold text-accent-primary tabular-nums">
                        {formatInr(carPrice)}
                        <span className="ml-1 text-base font-medium text-ink-muted">per vehicle</span>
                      </span>
                      {personPrice && (
                        <span className="text-sm text-ink-muted tabular-nums">
                          or about {formatInr(personPrice)} per person
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-ink">Price on request</p>
                  )}

                  <dl className="flex flex-col gap-2 text-sm">
                    {pkg.pickup_location && <Row label="Pickup" value={pkg.pickup_location} />}
                    {pkg.drop_location && <Row label="Drop" value={pkg.drop_location} />}
                    {pkg.vehicle_type && <Row label="Vehicle" value={pkg.vehicle_type} />}
                  </dl>

                  <div className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                      <Link href={bookingHref(pkg)}>Book this package</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">
                        Ask on WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          {otherPackages.length > 0 && (
            <section className="mt-16 flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">Other packages</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherPackages.map((other) => {
                  const otherPrice = vehiclePrice(other);
                  return (
                    <li key={other.slug}>
                      <Link
                        href={packagePath(other)}
                        className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent-primary/50"
                      >
                        <span className="font-display font-bold text-ink">{other.title}</span>
                        {other.duration && <span className="text-sm text-ink-muted">{other.duration}</span>}
                        {otherPrice && (
                          <span className="mt-auto text-sm font-semibold text-accent-primary tabular-nums">
                            From {formatInr(otherPrice)}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-display font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Fact({ icon: Icon, text }: { icon: typeof Clock; text: string }) {
  return (
    <li className="flex items-center gap-2">
      <Icon size={18} className="text-accent-primary shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink text-right">{value}</dd>
    </div>
  );
}

function touristTripJsonLd(pkg: Package, price: number | null, image: string | null) {
  const places = pkg.places_to_visit ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${absoluteUrl(packagePath(pkg))}#trip`,
    name: pkg.title,
    description: pkg.description ?? undefined,
    url: absoluteUrl(packagePath(pkg)),
    image: image ?? undefined,
    touristType: "Pilgrims",
    provider: { "@id": businessId },
    ...(places.length > 0 && {
      itinerary: {
        "@type": "ItemList",
        itemListElement: places.map((name, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "TouristAttraction", name },
        })),
      },
    }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl(packagePath(pkg)),
        seller: { "@id": businessId },
      },
    }),
  };
}
