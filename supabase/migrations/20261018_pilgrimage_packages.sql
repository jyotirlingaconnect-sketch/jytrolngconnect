-- =============================================================
-- Seed: Core Pilgrimage Packages (Ujjain circuit)
-- Run this once in the Supabase SQL Editor (or `supabase db execute`).
-- Safe to re-run: skips insert if a package with the same slug exists.
-- Prices are starting estimates — edit from /admin/packages after import.
-- =============================================================

INSERT INTO public.packages (
  title, name, route, start_destination, destination_name, description,
  per_person_price, vehicle_price, discount_price, vehicle_type,
  duration, distance, days, nights, seating_capacity, is_ac, luggage_capacity,
  places_to_visit, days_itinerary, pricing_options,
  package_highlights, included_facilities, included_services, excluded_services,
  pickup_location, drop_location, cover_image, gallery_images,
  is_featured, is_popular, is_recommended, is_available,
  meta_title, meta_description, slug
)
SELECT * FROM (VALUES
  (
    'Ujjain to Omkareshwar Jyotirlinga Darshan',
    'Ujjain – Omkareshwar Day Trip',
    'Ujjain → Omkareshwar → Ujjain',
    'Ujjain', 'Omkareshwar',
    'A same-day round trip from Ujjain to the Omkareshwar Jyotirlinga, one of the twelve Jyotirlingas of Lord Shiva, set on an island in the Narmada river. Includes darshan at Mamleshwar temple and time at the Narmada ghats, with a comfortable AC vehicle and driver for the full day.',
    1800, 3500, 1600, 'Sedan / SUV',
    '1 Day', '≈140 km one-way (≈280 km round trip)', 1, 0, 6, true, '2 Medium Bags',
    ARRAY['Omkareshwar Jyotirlinga Temple','Mamleshwar Temple','Narmada Ghat','Omkareshwar Dam viewpoint'],
    '[
      {"day": 1, "title": "Ujjain to Omkareshwar & Back", "description": "Early morning pickup from Ujjain, drive to Omkareshwar (~3-3.5 hrs). Darshan at Omkareshwar Jyotirlinga and Mamleshwar Temple, time at the Narmada ghats for a holy dip/aarti, lunch break, and return drive to Ujjain by evening.", "notes": "Carry comfortable footwear for the temple walk and ghat steps.", "places": ["Omkareshwar Jyotirlinga Temple","Mamleshwar Temple","Narmada Ghat"]}
    ]'::jsonb,
    '[
      {"persons": 4, "price": 3500, "discount_price": 3200},
      {"persons": 6, "price": 5000, "discount_price": 4700},
      {"persons": 12, "price": 8500, "discount_price": 8000}
    ]'::jsonb,
    ARRAY['Darshan at a Jyotirlinga temple','Round trip in a single day','AC vehicle with driver','Flexible pickup time'],
    ARRAY['AC Vehicle','Driver Allowance','Toll & Parking'],
    ARRAY['Pickup & Drop from Ujjain','Point-to-point sightseeing stops'],
    ARRAY['Temple donations/VIP darshan tickets','Meals','Boat ride at ghats (if opted)'],
    'Ujjain', 'Ujjain',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop'],
    true, true, true, true,
    'Ujjain to Omkareshwar Day Trip | Jyotirling Connect',
    'Book a comfortable same-day Ujjain to Omkareshwar Jyotirlinga darshan trip with AC vehicle, driver and flexible pickup.',
    'ujjain-to-omkareshwar-day-trip'
  ),
  (
    'Ujjain to Maheshwar Narmada Ghat & Fort',
    'Ujjain – Maheshwar Day Trip',
    'Ujjain → Maheshwar → Ujjain',
    'Ujjain', 'Maheshwar',
    'A relaxed day trip from Ujjain to Maheshwar on the banks of the Narmada, known for the Maheshwar (Ahilya) Fort, ghats made famous in film and television, Baneshwar Mahadev Temple, and the town''s traditional handloom Maheshwari saree weaving.',
    1600, 3500, 1450, 'Sedan / SUV',
    '1 Day', '≈90 km one-way', 1, 0, 6, true, '2 Medium Bags',
    ARRAY['Maheshwar Fort (Ahilya Fort)','Narmada Ghats','Baneshwar Mahadev Temple','Handloom Saree Market'],
    '[
      {"day": 1, "title": "Ujjain to Maheshwar & Back", "description": "Morning departure from Ujjain, drive to Maheshwar (~2 hrs). Visit the Maheshwar Fort complex and temples, walk along the Narmada ghats, browse the local handloom weaving market, lunch, and return to Ujjain in the evening.", "notes": "Best visited in cooler morning/evening hours for the ghats.", "places": ["Maheshwar Fort","Narmada Ghats","Baneshwar Mahadev Temple"]}
    ]'::jsonb,
    '[
      {"persons": 4, "price": 3500, "discount_price": 3200},
      {"persons": 6, "price": 5000, "discount_price": 4700},
      {"persons": 12, "price": 8500, "discount_price": 8000}
    ]'::jsonb,
    ARRAY['Historic Maheshwar Fort & ghats','Narmada riverside visit','Local handloom shopping stop','AC vehicle with driver'],
    ARRAY['AC Vehicle','Driver Allowance','Toll & Parking'],
    ARRAY['Pickup & Drop from Ujjain','Point-to-point sightseeing stops'],
    ARRAY['Fort entry tickets (if any)','Meals','Shopping expenses'],
    'Ujjain', 'Ujjain',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop'],
    false, true, true, true,
    'Ujjain to Maheshwar Day Trip | Jyotirling Connect',
    'Visit Maheshwar Fort and the Narmada ghats on a comfortable day trip from Ujjain with AC vehicle and driver.',
    'ujjain-to-maheshwar-day-trip'
  ),
  (
    'Ujjain to Indore City & Temple Trip',
    'Ujjain – Indore Day Trip',
    'Ujjain → Indore → Ujjain',
    'Ujjain', 'Indore',
    'A short, flexible day trip or transfer between Ujjain and Indore covering the Khajrana Ganesh Temple, Lal Bagh Palace, and the historic Rajwada, with an evening option to experience the famous Sarafa Bazaar night food market.',
    1200, 2500, 1100, 'Sedan / SUV',
    '1 Day', '≈55 km one-way', 1, 0, 6, true, '2 Medium Bags',
    ARRAY['Khajrana Ganesh Temple','Lal Bagh Palace','Rajwada','Sarafa Bazaar'],
    '[
      {"day": 1, "title": "Ujjain to Indore & Back", "description": "Pickup from Ujjain, short drive to Indore (~1-1.5 hrs). Darshan at Khajrana Ganesh Temple, visit Lal Bagh Palace and Rajwada, free time for shopping/food at Sarafa Bazaar, and return to Ujjain or onward drop as needed.", "notes": "Can also be booked as a one-way transfer (e.g., airport/railway station drop).", "places": ["Khajrana Ganesh Temple","Lal Bagh Palace","Rajwada","Sarafa Bazaar"]}
    ]'::jsonb,
    '[
      {"persons": 4, "price": 2500, "discount_price": 2300},
      {"persons": 6, "price": 3800, "discount_price": 3500}
    ]'::jsonb,
    ARRAY['Khajrana Ganesh Temple darshan','Heritage palace visit','Sarafa Bazaar food market','Can be booked as one-way transfer'],
    ARRAY['AC Vehicle','Driver Allowance','Toll & Parking'],
    ARRAY['Pickup & Drop from Ujjain','Point-to-point sightseeing stops'],
    ARRAY['Monument entry tickets','Meals/street food costs'],
    'Ujjain', 'Ujjain / Indore',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop'],
    false, false, false, true,
    'Ujjain to Indore Day Trip | Jyotirling Connect',
    'Comfortable Ujjain to Indore day trip or one-way transfer covering Khajrana Temple, Lal Bagh Palace and Sarafa Bazaar.',
    'ujjain-to-indore-day-trip'
  ),
  (
    'Omkareshwar – Ujjain – Mandu – Maheshwar Circuit',
    'Malwa Heritage & Jyotirlinga Circuit',
    'Ujjain → Omkareshwar → Mandu → Maheshwar → Indore',
    'Ujjain', 'Omkareshwar / Mandu / Maheshwar',
    'A 3-day circuit through the Malwa region covering a Jyotirlinga darshan at Omkareshwar, the medieval monuments of Mandu, and the riverside fort town of Maheshwar, with a final drop at Indore. A good fit for pilgrims who also want to see the region''s heritage architecture.',
    6500, 12000, 6000, 'SUV / Traveller',
    '3 Days 2 Nights', '≈330 km total circuit', 3, 2, 7, true, '4 Large Bags',
    ARRAY['Mahakaleshwar Temple (start)','Omkareshwar Jyotirlinga','Mamleshwar Temple','Jahaz Mahal','Hoshang Shah Tomb','Rani Roopmati Pavilion','Maheshwar Fort','Narmada Ghats'],
    '[
      {"day": 1, "title": "Ujjain to Omkareshwar", "description": "Morning darshan at Mahakaleshwar in Ujjain, then drive to Omkareshwar (~3 hrs). Evening darshan and aarti at the Omkareshwar Jyotirlinga and Mamleshwar Temple. Overnight stay near Omkareshwar.", "notes": "Hotel stay to be arranged separately or add-on.", "places": ["Mahakaleshwar Temple","Omkareshwar Jyotirlinga","Mamleshwar Temple"]},
      {"day": 2, "title": "Omkareshwar to Mandu via Maheshwar", "description": "Morning drive towards Mandu via Maheshwar (~90 km total). Short stop at Maheshwar Fort and the Narmada ghats, then continue to Mandu for sightseeing at Jahaz Mahal, Hoshang Shah''s Tomb, and Rani Roopmati Pavilion. Overnight stay in Mandu.", "notes": "Mandu sightseeing involves a fair amount of walking between monuments.", "places": ["Maheshwar Fort","Jahaz Mahal","Hoshang Shah Tomb","Rani Roopmati Pavilion"]},
      {"day": 3, "title": "Mandu to Maheshwar & Drop at Indore", "description": "Morning at leisure in Mandu, drive back via Maheshwar for a longer visit to the ghats and handloom market, lunch, and onward drop at Indore (railway station/airport) or back to Ujjain.", "notes": "Drop city/point can be customised at booking.", "places": ["Maheshwar Fort","Narmada Ghats"]}
    ]'::jsonb,
    '[
      {"persons": 4, "price": 12000, "discount_price": 11000},
      {"persons": 7, "price": 18000, "discount_price": 16500},
      {"persons": 14, "price": 28000, "discount_price": 26000}
    ]'::jsonb,
    ARRAY['Covers a Jyotirlinga + 2 heritage towns in one trip','2 nights on a single fixed vehicle','Flexible pickup (Ujjain) and drop (Indore)','Ideal for families & small groups'],
    ARRAY['AC Vehicle for full circuit','Driver Allowance','Toll & Parking','Driver Night Halt Charges'],
    ARRAY['Pickup from Ujjain','Drop at Indore (or Ujjain on request)','All point-to-point transfers in the circuit'],
    ARRAY['Hotel/accommodation (can be arranged on request)','Meals','Monument entry tickets','Temple donations/VIP darshan'],
    'Ujjain', 'Indore',
    'https://images.unsplash.com/photo-1522046428448-6a58bcba9830?q=80&w=2000&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1522046428448-6a58bcba9830?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop'
    ],
    true, true, true, true,
    'Omkareshwar Ujjain Mandu Maheshwar Tour | Jyotirling Connect',
    '3 day 2 night Malwa circuit covering Omkareshwar Jyotirlinga, Mandu heritage monuments and Maheshwar fort with AC vehicle.',
    'omkareshwar-ujjain-mandu-maheshwar-circuit'
  )
) AS v(
  title, name, route, start_destination, destination_name, description,
  per_person_price, vehicle_price, discount_price, vehicle_type,
  duration, distance, days, nights, seating_capacity, is_ac, luggage_capacity,
  places_to_visit, days_itinerary, pricing_options,
  package_highlights, included_facilities, included_services, excluded_services,
  pickup_location, drop_location, cover_image, gallery_images,
  is_featured, is_popular, is_recommended, is_available,
  meta_title, meta_description, slug
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.packages p WHERE p.slug = v.slug
);
