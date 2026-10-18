import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import { OgCard, loadOgFonts, ogSize } from "@/lib/og";

export const alt = "Jyotirling Connect tour packages — Ujjain, Omkareshwar & Maheshwar";
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 3600;

type PriceRow = {
  discount_price: number | null;
  per_person_price: number | null;
  price: number | null;
};

export default async function Image() {
  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("is_available", true);

  const prices = ((data ?? []) as PriceRow[])
    .map((pkg) => pkg.discount_price || pkg.per_person_price || pkg.price)
    .filter((price): price is number => typeof price === "number" && price > 0);
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
