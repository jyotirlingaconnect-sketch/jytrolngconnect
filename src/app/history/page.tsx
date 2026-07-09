import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HistoryClient } from "./HistoryClient";

export const metadata: Metadata = {
  title: "History & Heritage | Jyotirling Connect",
  description: "Discover the rich historical background, ancient mythology, and spiritual significance of the sacred destinations on our Jyotirlinga Yatra.",
  openGraph: {
    title: "History & Heritage | Jyotirling Connect",
    description: "Discover the rich historical background, ancient mythology, and spiritual significance of the sacred destinations on our Jyotirlinga Yatra.",
    url: "/history",
    type: "website",
  },
};

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <HistoryClient />
      </main>
      <Footer />
    </>
  );
}
