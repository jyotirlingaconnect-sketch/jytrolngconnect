import { useState, useEffect } from "react";

export type GalleryItem = {
  id: string;
  image_url: string;
  title?: string;
};

const FALLBACK_IMAGES: GalleryItem[] = [
  { id: "fallback-1", image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop", title: "Luxury Journey" },
  { id: "fallback-2", image_url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2000&auto=format&fit=crop", title: "Temple Visit" },
  { id: "fallback-3", image_url: "https://images.unsplash.com/photo-1596700542385-2e06dce4ef4d?q=80&w=2000&auto=format&fit=crop", title: "Sacred River" },
  { id: "fallback-4", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop", title: "Premium Fleet" },
  { id: "fallback-5", image_url: "https://images.unsplash.com/photo-1627896157734-4d7d42777174?q=80&w=2000&auto=format&fit=crop", title: "Devotion" },
  { id: "fallback-6", image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000&auto=format&fit=crop", title: "Aarti" },
  { id: "fallback-7", image_url: "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?q=80&w=2000&auto=format&fit=crop", title: "Flowers" },
  { id: "fallback-8", image_url: "https://images.unsplash.com/photo-1605335036611-e63d308f2a1b?q=80&w=2000&auto=format&fit=crop", title: "Scenery" }
];

export function useGalleryImages() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (data.items && data.items.length > 0) {
          // If we have less than 8 images, we might want to duplicate them to fill the grid
          let displayImages = [...data.items];
          while (displayImages.length < 12) {
            displayImages = [...displayImages, ...data.items];
          }
          setImages(displayImages);
        } else {
          setImages(FALLBACK_IMAGES);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setImages(FALLBACK_IMAGES);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return { images, loading };
}
