"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbox } from "@/components/ui/Lightbox";

interface GalleryItem {
  id: string;
  image_url: string;
  title?: string | null;
  description?: string | null;
  created_at?: string;
}

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

// A simple deterministic hash function based on ID to decide grid spans
const hashId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash);
};

export function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Compute layout sizes stably based on item ID
  const galleryItems = useMemo(() => {
    return initialItems.map((item) => {
      // Every 6th to 8th item roughly becomes a featured span, generated deterministically
      const hash = hashId(item.id);
      
      let colSpan = "col-span-1";
      let rowSpan = "row-span-1";
      
      // Approximately 20% chance for a special span to create a Pinterest/Bento feel
      const isSpecial = hash % 5 === 0; 
      
      if (isSpecial) {
        const type = hash % 3;
        if (type === 0) {
          // Large square
          colSpan = "md:col-span-2";
          rowSpan = "row-span-2";
        } else if (type === 1) {
          // Wide landscape
          colSpan = "col-span-2";
          rowSpan = "row-span-1";
        } else {
          // Tall portrait
          colSpan = "col-span-1";
          rowSpan = "row-span-2 md:row-span-3";
        }
      }

      return { ...item, colSpan, rowSpan };
    });
  }, [initialItems]);

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % galleryItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  if (galleryItems.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-2xl">
        <h3 className="text-2xl font-display text-ink-muted">No images found</h3>
        <p className="text-ink-muted/80 mt-2">Check back later for stunning photos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 auto-rows-[150px] md:auto-rows-[200px] grid-flow-dense">
        {galleryItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (i % 15) * 0.05 }}
            className={`relative group overflow-hidden rounded-xl bg-black/5 shadow-sm cursor-pointer hover:shadow-xl transition-all duration-500 ${item.colSpan} ${item.rowSpan}`}
            onClick={() => setSelectedImageIndex(i)}
          >
            {/* The wrapper div uses absolute inset to perfectly fill the grid cell regardless of intrinsic image size */}
            <div className="absolute inset-0">
              <Image
                src={item.image_url}
                alt={item.title || "Gallery Image"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={item.image_url.includes("placehold.co")}
              />
            </div>
            
            {/* Hover Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {item.title && <h3 className="text-white font-display text-sm md:text-lg font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>}
              {item.description && <p className="text-white/80 text-xs mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">{item.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={galleryItems}
        currentIndex={selectedImageIndex ?? 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
