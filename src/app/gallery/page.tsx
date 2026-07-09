import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

import { GalleryClient } from "./GalleryClient";

export const metadata = {
  title: "Gallery | Jyotirling Connect",
  description: "View our gallery of the sacred journey between Mahakaleshwar and Omkareshwar Jyotirlinga.",
};

export default async function GalleryPage() {
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Fallback placeholder images if no data
  const items = (galleryItems && galleryItems.length > 0) ? galleryItems : [
    { id: "1", image_url: "https://placehold.co/600x400/FFE5B4/A63A1E?text=Mahakaleshwar", title: "Mahakaleshwar Temple" },
    { id: "2", image_url: "https://placehold.co/400x600/FFE5B4/A63A1E?text=Omkareshwar", title: "Omkareshwar Jyotirlinga" },
    { id: "3", image_url: "https://placehold.co/600x600/FFE5B4/A63A1E?text=Narmada+River", title: "Narmada River Ghat" },
    { id: "4", image_url: "https://placehold.co/800x400/FFE5B4/A63A1E?text=Premium+Fleet", title: "Our Premium Fleet" },
    { id: "5", image_url: "https://placehold.co/800x800/FFE5B4/A63A1E?text=Sacred+Puja", title: "Sacred Puja Rituals" },
    { id: "6", image_url: "https://placehold.co/500x700/FFE5B4/A63A1E?text=Bhasma+Aarti", title: "Bhasma Aarti" },
    { id: "7", image_url: "https://placehold.co/1000x500/FFE5B4/A63A1E?text=Scenic+Route", title: "The Scenic Route" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-ink mb-6">
              Gallery
            </h1>
            <p className="text-lg md:text-xl text-ink-muted leading-relaxed">
              Glimpses of the divine journey. Explore the sacred temples, beautiful routes, and our comfortable vehicles.
            </p>
          </div>

          <GalleryClient initialItems={items} />
        </div>
      </main>
      <Footer />
    </>
  );
}
