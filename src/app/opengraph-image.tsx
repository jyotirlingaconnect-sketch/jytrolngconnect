import { ImageResponse } from "next/og";
import { OgCard, loadOgFonts, ogSize } from "@/lib/og";

export const alt = "Jyotirling Connect — Premium Pilgrimage Travel";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Premium Pilgrimage Travel"
        title="Jyotirling Connect"
        subtitle="Mahakaleshwar · Omkareshwar · Maheshwar — comfortable AC vehicles with verified drivers."
        badge="Book your yatra"
      />
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
