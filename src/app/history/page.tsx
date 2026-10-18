import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HistoryClient } from "./HistoryClient";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: "Mahakaleshwar & Omkareshwar History",
  description: "Discover the rich historical background, ancient mythology, and spiritual significance of the sacred destinations on our Jyotirlinga Yatra.",
  openGraph: {
    title: "History & Heritage | Jyotirling Connect",
    description: "Discover the rich historical background, ancient mythology, and spiritual significance of the sacred destinations on our Jyotirlinga Yatra.",
    url: "/history",
    type: "website",
  },
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "History", path: "/history" },
        ])}
      />
      <Navbar />
      <main className="overflow-hidden">
        <HistoryClient />
      </main>
      <Footer />
    </>
  );
}
