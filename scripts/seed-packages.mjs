import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const packages = [
  {
    title: "Ujjain to Omkareshwar Jyotirlinga Darshan",
    name: "Ujjain – Omkareshwar Day Trip",
    route: "Ujjain → Omkareshwar → Ujjain",
    start_destination: "Ujjain",
    destination_name: "Omkareshwar",
    description:
      "A same-day round trip from Ujjain to the Omkareshwar Jyotirlinga, one of the twelve Jyotirlingas of Lord Shiva, set on an island in the Narmada river. Includes darshan at Mamleshwar temple and time at the Narmada ghats, with a comfortable AC vehicle and driver for the full day.",
    per_person_price: 1800,
    vehicle_price: 3500,
    discount_price: 1600,
    vehicle_type: "Sedan / SUV",
    duration: "1 Day",
    distance: "≈140 km one-way (≈280 km round trip)",
    days: 1,
    nights: 0,
    seating_capacity: 6,
    is_ac: true,
    luggage_capacity: "2 Medium Bags",
    places_to_visit: [
      "Omkareshwar Jyotirlinga Temple",
      "Mamleshwar Temple",
      "Narmada Ghat",
      "Omkareshwar Dam viewpoint",
    ],
    days_itinerary: [
      {
        day: 1,
        title: "Ujjain to Omkareshwar & Back",
        description:
          "Early morning pickup from Ujjain, drive to Omkareshwar (~3-3.5 hrs). Darshan at Omkareshwar Jyotirlinga and Mamleshwar Temple, time at the Narmada ghats for a holy dip/aarti, lunch break, and return drive to Ujjain by evening.",
        notes: "Carry comfortable footwear for the temple walk and ghat steps.",
        places: ["Omkareshwar Jyotirlinga Temple", "Mamleshwar Temple", "Narmada Ghat"],
      },
    ],
    pricing_options: [
      { persons: 4, price: 3500, discount_price: 3200 },
      { persons: 6, price: 5000, discount_price: 4700 },
      { persons: 12, price: 8500, discount_price: 8000 },
    ],
    package_highlights: [
      "Darshan at a Jyotirlinga temple",
      "Round trip in a single day",
      "AC vehicle with driver",
      "Flexible pickup time",
    ],
    included_facilities: ["AC Vehicle", "Driver Allowance", "Toll & Parking"],
    included_services: ["Pickup & Drop from Ujjain", "Point-to-point sightseeing stops"],
    excluded_services: [
      "Temple donations/VIP darshan tickets",
      "Meals",
      "Boat ride at ghats (if opted)",
    ],
    pickup_location: "Ujjain",
    drop_location: "Ujjain",
    cover_image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop",
    ],
    is_featured: true,
    is_popular: true,
    is_recommended: true,
    is_available: true,
    meta_title: "Ujjain to Omkareshwar Day Trip | Jyotirling Connect",
    meta_description:
      "Book a comfortable same-day Ujjain to Omkareshwar Jyotirlinga darshan trip with AC vehicle, driver and flexible pickup.",
    slug: "ujjain-to-omkareshwar-day-trip",
  },
  {
    title: "Ujjain to Maheshwar Narmada Ghat & Fort",
    name: "Ujjain – Maheshwar Day Trip",
    route: "Ujjain → Maheshwar → Ujjain",
    start_destination: "Ujjain",
    destination_name: "Maheshwar",
    description:
      "A relaxed day trip from Ujjain to Maheshwar on the banks of the Narmada, known for the Maheshwar (Ahilya) Fort, ghats made famous in film and television, Baneshwar Mahadev Temple, and the town's traditional handloom Maheshwari saree weaving.",
    per_person_price: 1600,
    vehicle_price: 3500,
    discount_price: 1450,
    vehicle_type: "Sedan / SUV",
    duration: "1 Day",
    distance: "≈90 km one-way",
    days: 1,
    nights: 0,
    seating_capacity: 6,
    is_ac: true,
    luggage_capacity: "2 Medium Bags",
    places_to_visit: [
      "Maheshwar Fort (Ahilya Fort)",
      "Narmada Ghats",
      "Baneshwar Mahadev Temple",
      "Handloom Saree Market",
    ],
    days_itinerary: [
      {
        day: 1,
        title: "Ujjain to Maheshwar & Back",
        description:
          "Morning departure from Ujjain, drive to Maheshwar (~2 hrs). Visit the Maheshwar Fort complex and temples, walk along the Narmada ghats, browse the local handloom weaving market, lunch, and return to Ujjain in the evening.",
        notes: "Best visited in cooler morning/evening hours for the ghats.",
        places: ["Maheshwar Fort", "Narmada Ghats", "Baneshwar Mahadev Temple"],
      },
    ],
    pricing_options: [
      { persons: 4, price: 3500, discount_price: 3200 },
      { persons: 6, price: 5000, discount_price: 4700 },
      { persons: 12, price: 8500, discount_price: 8000 },
    ],
    package_highlights: [
      "Historic Maheshwar Fort & ghats",
      "Narmada riverside visit",
      "Local handloom shopping stop",
      "AC vehicle with driver",
    ],
    included_facilities: ["AC Vehicle", "Driver Allowance", "Toll & Parking"],
    included_services: ["Pickup & Drop from Ujjain", "Point-to-point sightseeing stops"],
    excluded_services: ["Fort entry tickets (if any)", "Meals", "Shopping expenses"],
    pickup_location: "Ujjain",
    drop_location: "Ujjain",
    cover_image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop",
    ],
    is_featured: false,
    is_popular: true,
    is_recommended: true,
    is_available: true,
    meta_title: "Ujjain to Maheshwar Day Trip | Jyotirling Connect",
    meta_description:
      "Visit Maheshwar Fort and the Narmada ghats on a comfortable day trip from Ujjain with AC vehicle and driver.",
    slug: "ujjain-to-maheshwar-day-trip",
  },
  {
    title: "Ujjain to Indore City & Temple Trip",
    name: "Ujjain – Indore Day Trip",
    route: "Ujjain → Indore → Ujjain",
    start_destination: "Ujjain",
    destination_name: "Indore",
    description:
      "A short, flexible day trip or transfer between Ujjain and Indore covering the Khajrana Ganesh Temple, Lal Bagh Palace, and the historic Rajwada, with an evening option to experience the famous Sarafa Bazaar night food market.",
    per_person_price: 1200,
    vehicle_price: 2500,
    discount_price: 1100,
    vehicle_type: "Sedan / SUV",
    duration: "1 Day",
    distance: "≈55 km one-way",
    days: 1,
    nights: 0,
    seating_capacity: 6,
    is_ac: true,
    luggage_capacity: "2 Medium Bags",
    places_to_visit: ["Khajrana Ganesh Temple", "Lal Bagh Palace", "Rajwada", "Sarafa Bazaar"],
    days_itinerary: [
      {
        day: 1,
        title: "Ujjain to Indore & Back",
        description:
          "Pickup from Ujjain, short drive to Indore (~1-1.5 hrs). Darshan at Khajrana Ganesh Temple, visit Lal Bagh Palace and Rajwada, free time for shopping/food at Sarafa Bazaar, and return to Ujjain or onward drop as needed.",
        notes: "Can also be booked as a one-way transfer (e.g., airport/railway station drop).",
        places: ["Khajrana Ganesh Temple", "Lal Bagh Palace", "Rajwada", "Sarafa Bazaar"],
      },
    ],
    pricing_options: [
      { persons: 4, price: 2500, discount_price: 2300 },
      { persons: 6, price: 3800, discount_price: 3500 },
    ],
    package_highlights: [
      "Khajrana Ganesh Temple darshan",
      "Heritage palace visit",
      "Sarafa Bazaar food market",
      "Can be booked as one-way transfer",
    ],
    included_facilities: ["AC Vehicle", "Driver Allowance", "Toll & Parking"],
    included_services: ["Pickup & Drop from Ujjain", "Point-to-point sightseeing stops"],
    excluded_services: ["Monument entry tickets", "Meals/street food costs"],
    pickup_location: "Ujjain",
    drop_location: "Ujjain / Indore",
    cover_image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop",
    ],
    is_featured: false,
    is_popular: false,
    is_recommended: false,
    is_available: true,
    meta_title: "Ujjain to Indore Day Trip | Jyotirling Connect",
    meta_description:
      "Comfortable Ujjain to Indore day trip or one-way transfer covering Khajrana Temple, Lal Bagh Palace and Sarafa Bazaar.",
    slug: "ujjain-to-indore-day-trip",
  },
  {
    title: "Omkareshwar – Ujjain – Mandu – Maheshwar Circuit",
    name: "Malwa Heritage & Jyotirlinga Circuit",
    route: "Ujjain → Omkareshwar → Mandu → Maheshwar → Indore",
    start_destination: "Ujjain",
    destination_name: "Omkareshwar / Mandu / Maheshwar",
    description:
      "A 3-day circuit through the Malwa region covering a Jyotirlinga darshan at Omkareshwar, the medieval monuments of Mandu, and the riverside fort town of Maheshwar, with a final drop at Indore. A good fit for pilgrims who also want to see the region's heritage architecture.",
    per_person_price: 6500,
    vehicle_price: 12000,
    discount_price: 6000,
    vehicle_type: "SUV / Traveller",
    duration: "3 Days 2 Nights",
    distance: "≈330 km total circuit",
    days: 3,
    nights: 2,
    seating_capacity: 7,
    is_ac: true,
    luggage_capacity: "4 Large Bags",
    places_to_visit: [
      "Mahakaleshwar Temple (start)",
      "Omkareshwar Jyotirlinga",
      "Mamleshwar Temple",
      "Jahaz Mahal",
      "Hoshang Shah Tomb",
      "Rani Roopmati Pavilion",
      "Maheshwar Fort",
      "Narmada Ghats",
    ],
    days_itinerary: [
      {
        day: 1,
        title: "Ujjain to Omkareshwar",
        description:
          "Morning darshan at Mahakaleshwar in Ujjain, then drive to Omkareshwar (~3 hrs). Evening darshan and aarti at the Omkareshwar Jyotirlinga and Mamleshwar Temple. Overnight stay near Omkareshwar.",
        notes: "Hotel stay to be arranged separately or add-on.",
        places: ["Mahakaleshwar Temple", "Omkareshwar Jyotirlinga", "Mamleshwar Temple"],
      },
      {
        day: 2,
        title: "Omkareshwar to Mandu via Maheshwar",
        description:
          "Morning drive towards Mandu via Maheshwar (~90 km total). Short stop at Maheshwar Fort and the Narmada ghats, then continue to Mandu for sightseeing at Jahaz Mahal, Hoshang Shah's Tomb, and Rani Roopmati Pavilion. Overnight stay in Mandu.",
        notes: "Mandu sightseeing involves a fair amount of walking between monuments.",
        places: ["Maheshwar Fort", "Jahaz Mahal", "Hoshang Shah Tomb", "Rani Roopmati Pavilion"],
      },
      {
        day: 3,
        title: "Mandu to Maheshwar & Drop at Indore",
        description:
          "Morning at leisure in Mandu, drive back via Maheshwar for a longer visit to the ghats and handloom market, lunch, and onward drop at Indore (railway station/airport) or back to Ujjain.",
        notes: "Drop city/point can be customised at booking.",
        places: ["Maheshwar Fort", "Narmada Ghats"],
      },
    ],
    pricing_options: [
      { persons: 4, price: 12000, discount_price: 11000 },
      { persons: 7, price: 18000, discount_price: 16500 },
      { persons: 14, price: 28000, discount_price: 26000 },
    ],
    package_highlights: [
      "Covers a Jyotirlinga + 2 heritage towns in one trip",
      "2 nights on a single fixed vehicle",
      "Flexible pickup (Ujjain) and drop (Indore)",
      "Ideal for families & small groups",
    ],
    included_facilities: [
      "AC Vehicle for full circuit",
      "Driver Allowance",
      "Toll & Parking",
      "Driver Night Halt Charges",
    ],
    included_services: [
      "Pickup from Ujjain",
      "Drop at Indore (or Ujjain on request)",
      "All point-to-point transfers in the circuit",
    ],
    excluded_services: [
      "Hotel/accommodation (can be arranged on request)",
      "Meals",
      "Monument entry tickets",
      "Temple donations/VIP darshan",
    ],
    pickup_location: "Ujjain",
    drop_location: "Indore",
    cover_image:
      "https://images.unsplash.com/photo-1522046428448-6a58bcba9830?q=80&w=2000&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1522046428448-6a58bcba9830?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop",
    ],
    is_featured: true,
    is_popular: true,
    is_recommended: true,
    is_available: true,
    meta_title: "Omkareshwar Ujjain Mandu Maheshwar Tour | Jyotirling Connect",
    meta_description:
      "3 day 2 night Malwa circuit covering Omkareshwar Jyotirlinga, Mandu heritage monuments and Maheshwar fort with AC vehicle.",
    slug: "omkareshwar-ujjain-mandu-maheshwar-circuit",
  },
];

async function run() {
  for (const pkg of packages) {
    const { data: existing } = await supabase
      .from("packages")
      .select("id")
      .eq("slug", pkg.slug)
      .maybeSingle();

    if (existing) {
      console.log(`SKIP (already exists): ${pkg.slug}`);
      continue;
    }

    const { error } = await supabase.from("packages").insert([pkg]);
    if (error) {
      console.error(`FAILED: ${pkg.slug}`, error.message);
    } else {
      console.log(`INSERTED: ${pkg.slug}`);
    }
  }
}

run().then(() => {
  console.log("Done.");
});
