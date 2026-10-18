import { ImageResponse } from "next/og";
import { OgCard, loadOgFonts, ogSize } from "@/lib/og";
import { getAvailablePackages, vehiclePrice } from "@/lib/packages";

export const alt = "Jyotirling Connect tour packages — Ujjain, Omkareshwar & Maheshwar";
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
  const prices = (await getAvailablePackages())
    .map(vehiclePrice)
    .filter((price): price is number => price !== null);
  const lowest = prices.length > 0 ? Math.min(...prices) : null;

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Tour Packages"
        title="Ujjain, Omkareshwar & Maheshwar Yatra"
        subtitle={`${prices.length || "Curated"} packages with AC vehicles, driver and flexible pickup.`}
        badge={lowest ? `From Rs. ${lowest.toLocaleString("en-IN")}` : "View packages"}
      />
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
