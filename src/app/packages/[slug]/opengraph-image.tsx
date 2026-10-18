import { ImageResponse } from "next/og";
import { OgCard, loadOgFonts, ogSize } from "@/lib/og";
import { getPackageBySlug, vehiclePrice } from "@/lib/packages";

export const alt = "Jyotirling Connect tour package";
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  const price = pkg ? vehiclePrice(pkg) : null;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={pkg?.duration ? `Tour package · ${pkg.duration}` : "Tour package"}
        title={pkg?.title ?? "Jyotirlinga Yatra Packages"}
        subtitle={pkg?.route ?? "Private AC vehicle with driver and flexible pickup."}
        badge={price ? `From Rs. ${price.toLocaleString("en-IN")}` : "Book now"}
      />
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
