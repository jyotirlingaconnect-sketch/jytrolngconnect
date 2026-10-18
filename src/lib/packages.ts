import { supabase } from "@/lib/supabase";

export type ItineraryDay = {
  day: number;
  title: string;
  description?: string;
  notes?: string;
  places?: string[];
};

export type PricingOption = {
  persons: number;
  price: number;
  discount_price?: number | null;
};

export type Package = {
  id: string;
  slug: string;
  title: string;
  route: string | null;
  description: string | null;
  duration: string | null;
  distance: string | null;
  days: number | null;
  nights: number | null;
  vehicle_type: string | null;
  seating_capacity: number | null;
  places_to_visit: string[] | null;
  days_itinerary: ItineraryDay[] | null;
  pricing_options: PricingOption[] | null;
  package_highlights: string[] | null;
  included_facilities: string[] | null;
  included_services: string[] | null;
  excluded_services: string[] | null;
  pickup_location: string | null;
  drop_location: string | null;
  cover_image: string | null;
  images: string[] | null;
  vehicle_price: number | null;
  per_person_price: number | null;
  discount_price: number | null;
  price: number | null;
  meta_title: string | null;
  meta_description: string | null;
  is_popular: boolean | null;
  created_at: string;
  updated_at: string | null;
};

const packageColumns =
  "id, slug, title, route, description, duration, distance, days, nights, vehicle_type, seating_capacity, places_to_visit, days_itinerary, pricing_options, package_highlights, included_facilities, included_services, excluded_services, pickup_location, drop_location, cover_image, images, vehicle_price, per_person_price, discount_price, price, meta_title, meta_description, is_popular, created_at, updated_at";

export async function getAvailablePackages(): Promise<Package[]> {
  const { data } = await supabase
    .from("packages")
    .select(packageColumns)
    .eq("is_available", true)
    .not("slug", "is", null)
    .order("created_at", { ascending: true });
  return (data ?? []) as Package[];
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const { data } = await supabase
    .from("packages")
    .select(packageColumns)
    .eq("slug", slug)
    .eq("is_available", true)
    .maybeSingle();
  return (data as Package | null) ?? null;
}

export function vehiclePrice(pkg: Package): number | null {
  return positive(pkg.vehicle_price) ?? positive(pkg.price);
}

export function perPersonPrice(pkg: Package): number | null {
  return positive(pkg.discount_price) ?? positive(pkg.per_person_price);
}

export function coverImage(pkg: Package): string | null {
  return pkg.cover_image || pkg.images?.[0] || null;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function bookingHref(pkg: Package): string {
  const params = new URLSearchParams({ package: pkg.title });
  if (pkg.vehicle_type) params.set("vehicle", pkg.vehicle_type);
  return `/booking?${params.toString()}`;
}

export function packagePath(pkg: Pick<Package, "slug">): string {
  return `/packages/${pkg.slug}`;
}

function positive(value: number | null): number | null {
  return typeof value === "number" && value > 0 ? value : null;
}
