import type { Faq } from "@/lib/faqs";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.jyotirlingconnect.com"
).replace(/\/$/, "");

export const businessId = `${siteUrl}/#business`;

type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${siteUrl}${path === "/" ? "" : path}`;

const serviceCities = ["Ujjain", "Indore", "Omkareshwar", "Maheshwar", "Mandu"];

export const businessJsonLd: JsonLdData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": businessId,
  name: "Jyotirling Connect",
  url: siteUrl,
  logo: absoluteUrl("/icon-512.png"),
  image: absoluteUrl("/opengraph-image"),
  description:
    "Private AC taxi, Innova Crysta and tempo traveller hire for pilgrims travelling between Ujjain (Mahakaleshwar), Omkareshwar, Maheshwar, Mandu and Indore.",
  telephone: "+91-6268032441",
  email: "Jyotirlingaconnect@gmail.com",
  priceRange: "₹₹",
  areaServed: serviceCities.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: "Madhya Pradesh" },
  })),
};

export const websiteJsonLd: JsonLdData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Jyotirling Connect",
  url: siteUrl,
  inLanguage: "en-IN",
  publisher: { "@id": businessId },
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
