import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const metadata = {
  title: "Gallery | Jyotirling Connect",
  description: "View our gallery of the sacred journey between Mahakaleshwar and Omkareshwar Jyotirlinga.",
};

// Next.js config to allow images from Supabase storage (we'll assume standard domains or just allow all for now)
// We will use standard img tag or next/image with unoptimized if hostname is unknown.

export default async function GalleryPage() {
  const { data: galleryItems, error } = await supabase
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
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Gallery
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              Glimpses of the divine journey. Explore the sacred temples, beautiful routes, and our comfortable vehicles.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-surface shadow-sm hover:shadow-md transition-all">
                {/* We use standard img to avoid next/image domain restrictions for unknown URLs */}
                <img
                  src={item.image_url}
                  alt={item.title || "Gallery Image"}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {(item.title || item.description) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    {item.title && <h3 className="text-white font-display text-xl font-bold">{item.title}</h3>}
                    {item.description && <p className="text-white/80 text-sm mt-2">{item.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
