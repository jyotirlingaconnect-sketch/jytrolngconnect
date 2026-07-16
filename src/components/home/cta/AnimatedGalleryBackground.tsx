"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GalleryItem } from "./useGalleryImages";

// We want a large grid so we have enough tiles to scroll infinitely
const ROW_COUNT = 10;
const COL_COUNT = 15;
const TILE_WIDTH = 320;
const TILE_HEIGHT = 220;
const TILE_GAP = 32;

const TOTAL_WIDTH = COL_COUNT * (TILE_WIDTH + TILE_GAP);
const TOTAL_HEIGHT = ROW_COUNT * (TILE_HEIGHT + TILE_GAP);

export function AnimatedGalleryBackground({ images }: { images: GalleryItem[] }) {
  const [phase, setPhase] = useState<"horizontal" | "vertical">("horizontal");

  // Switch phases every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p === "horizontal" ? "vertical" : "horizontal"));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fill the grid with images
  const gridItems = useMemo(() => {
    const items = [];
    for (let r = 0; r < ROW_COUNT; r++) {
      for (let c = 0; c < COL_COUNT; c++) {
        // Just loop through available images
        const imgIndex = (r * COL_COUNT + c) % Math.max(images.length, 1);
        items.push({ row: r, col: c, image: images[imgIndex] });
      }
    }
    return items;
  }, [images]);

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden bg-ink pointer-events-none" 
      style={{ perspective: "1000px" }}
    >
      {/* Background static layer */}
      <div className="absolute inset-0 z-0 bg-ink" />

      {/* Grid container centered and slightly rotated for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-[200vw] min-h-[200vh] flex items-center justify-center scale-110">
        <AnimatePresence mode="popLayout">
          {phase === "horizontal" && (
            <motion.div
              key="horizontal-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div style={{ width: TOTAL_WIDTH, height: TOTAL_HEIGHT, position: "relative" }}>
                {gridItems.map((item, idx) => (
                  <MovingTile key={`h-${idx}`} item={item} direction="horizontal" />
                ))}
              </div>
            </motion.div>
          )}

          {phase === "vertical" && (
            <motion.div
              key="vertical-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div style={{ width: TOTAL_WIDTH, height: TOTAL_HEIGHT, position: "relative" }}>
                {gridItems.map((item, idx) => (
                  <MovingTile key={`v-${idx}`} item={item} direction="vertical" />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dark overlay & blur (Glass Overlay over the moving images) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-ink/45 via-ink/20 to-ink/45 backdrop-blur-[2px]" />
    </div>
  );
}

function MovingTile({ item, direction }: { item: {row: number, col: number, image: GalleryItem}, direction: "horizontal" | "vertical" }) {
  // Movement direction based on row/col index
  const dirMultiplier = direction === "horizontal" 
    ? (item.row % 2 === 0 ? -1 : 1) 
    : (item.col % 2 === 0 ? -1 : 1);

  // We want to translate infinitely. By duplicating the movement range, we can loop.
  // To avoid seeing the edge, we set the duration high and allow the large grid to cover it.
  const distance = direction === "horizontal" 
    ? 5 * (TILE_WIDTH + TILE_GAP) 
    : 5 * (TILE_HEIGHT + TILE_GAP);

  // Deterministic pseudo-random rotation for parallax/depth based on item indices
  const rot = useMemo(() => {
    const seed = item.row * 100 + item.col;
    const random = ((seed * 9301 + 49297) % 233280) / 233280;
    return (random - 0.5) * 6;
  }, [item.row, item.col]);
  // Mix sizes for a masonry feel (Large, Medium, Square, Portrait, Landscape)
  // We can randomize sizes based on index
  const sizeType = useMemo(() => {
    const types = ["large", "medium", "square", "portrait", "landscape"];
    return types[(item.row * COL_COUNT + item.col) % types.length];
  }, [item.row, item.col]);

  let width = TILE_WIDTH;
  let height = TILE_HEIGHT;

  switch(sizeType) {
    case "large": width = TILE_WIDTH * 1.5; height = TILE_HEIGHT * 1.5; break;
    case "portrait": width = TILE_WIDTH * 0.8; height = TILE_HEIGHT * 1.5; break;
    case "landscape": width = TILE_WIDTH * 1.5; height = TILE_HEIGHT * 0.8; break;
    case "square": width = TILE_WIDTH; height = TILE_WIDTH; break;
    default: break; // medium / default
  }

  return (
    <motion.div
      className="absolute rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      style={{
        width,
        height,
        // Center the tile around its grid point (without shifting the whole grid to top-left)
        left: item.col * (TILE_WIDTH + TILE_GAP) + (TILE_WIDTH - width) / 2,
        top: item.row * (TILE_HEIGHT + TILE_GAP) + (TILE_HEIGHT - height) / 2,
        willChange: "transform",
      }}
      initial={{
        x: 0,
        y: 0,
        rotate: rot
      }}
      animate={{
        x: direction === "horizontal" ? [0, dirMultiplier * distance] : 0,
        y: direction === "vertical" ? [0, dirMultiplier * distance] : 0,
        rotate: rot
      }}
      transition={{
        x: { duration: 40, repeat: Infinity, ease: "linear" },
        y: { duration: 40, repeat: Infinity, ease: "linear" },
      }}
    >
      <div className="relative w-full h-full">
        {item.image && (
          <Image
            src={item.image.image_url}
            alt={item.image.title || "Gallery image"}
            fill
            className="object-cover transition-transform duration-1000 hover:scale-110 hover:brightness-110"
            sizes={`${width}px`}
            unoptimized={item.image.image_url.includes('placehold.co')} 
          />
        )}
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
        <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
      </div>
    </motion.div>
  );
}
