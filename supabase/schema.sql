-- packages table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    name TEXT,
    route TEXT,
    start_destination TEXT DEFAULT 'Ujjain',
    destination_name TEXT,
    description TEXT,
    price DECIMAL(10, 2),
    per_person_price DECIMAL(10, 2),
    vehicle_price DECIMAL(10, 2),
    discount_price DECIMAL(10, 2),
    vehicle_type TEXT,
    duration TEXT,
    distance TEXT,
    days INTEGER,
    nights INTEGER,
    seating_capacity INTEGER,
    is_ac BOOLEAN DEFAULT true,
    luggage_capacity TEXT,
    places_to_visit TEXT[],
    days_itinerary JSONB DEFAULT '[]'::jsonb,
    pricing_options JSONB DEFAULT '[]'::jsonb,
    package_highlights TEXT[],
    included_facilities TEXT[],
    included_services TEXT[],
    excluded_services TEXT[],
    pickup_location TEXT,
    drop_location TEXT,
    cover_image TEXT,
    gallery_images TEXT[],
    images TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_recommended BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add new columns if this schema is applied to an existing database
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS start_destination TEXT DEFAULT 'Ujjain';
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS per_person_price DECIMAL(10, 2);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS vehicle_price DECIMAL(10, 2);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10, 2);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS days INTEGER;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS nights INTEGER;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS seating_capacity INTEGER;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS is_ac BOOLEAN DEFAULT true;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS luggage_capacity TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS places_to_visit TEXT[];
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS days_itinerary JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS pricing_options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS package_highlights TEXT[];
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS included_facilities TEXT[];
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS gallery_images TEXT[];
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT false;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS slug TEXT;

-- Safely migrate existing data
UPDATE public.packages SET per_person_price = price WHERE per_person_price IS NULL AND price IS NOT NULL;
UPDATE public.packages SET cover_image = images[1] WHERE cover_image IS NULL AND images IS NOT NULL AND array_length(images, 1) > 0;
UPDATE public.packages SET gallery_images = images WHERE gallery_images IS NULL AND images IS NOT NULL;

-- Migrate places_to_visit to days_itinerary
UPDATE public.packages 
SET days_itinerary = jsonb_build_array(
  jsonb_build_object('day', 1, 'title', 'Day 1', 'description', '', 'notes', '', 'places', COALESCE(array_to_json(places_to_visit), '[]'::json))
)
WHERE jsonb_array_length(days_itinerary) = 0 AND places_to_visit IS NOT NULL AND array_length(places_to_visit, 1) > 0;

-- Migrate per_person_price to pricing_options
UPDATE public.packages 
SET pricing_options = jsonb_build_array(
  jsonb_build_object('persons', 1, 'price', per_person_price, 'discount_price', discount_price)
)
WHERE jsonb_array_length(pricing_options) = 0 AND per_person_price IS NOT NULL;

-- gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    travel_date DATE,
    no_of_passengers INTEGER,
    vehicle_preference TEXT,
    pickup_location TEXT,
    drop_location TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add admin_notes if this schema is applied to an existing database
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- contact_info table
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_numbers TEXT[],
    whatsapp_number TEXT,
    email TEXT,
    address TEXT,
    google_maps_link TEXT,
    business_hours TEXT,
    additional_contacts JSONB
);

-- website_settings table
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_name TEXT NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    footer_text TEXT,
    copyright_text TEXT
);

-- testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (packages, gallery, testimonials, contact_info, website_settings)
DROP POLICY IF EXISTS "Public read access to packages" ON public.packages;
CREATE POLICY "Public read access to packages" ON public.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access to gallery" ON public.gallery;
CREATE POLICY "Public read access to gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access to testimonials" ON public.testimonials;
CREATE POLICY "Public read access to testimonials" ON public.testimonials FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public read access to contact_info" ON public.contact_info;
CREATE POLICY "Public read access to contact_info" ON public.contact_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access to website_settings" ON public.website_settings;
CREATE POLICY "Public read access to website_settings" ON public.website_settings FOR SELECT USING (true);

-- Allow public to insert bookings (but not read/update/delete)
DROP POLICY IF EXISTS "Public insert access to bookings" ON public.bookings;
CREATE POLICY "Public insert access to bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to do all operations on all tables
DROP POLICY IF EXISTS "Admin all access packages" ON public.packages;
CREATE POLICY "Admin all access packages" ON public.packages FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all access gallery" ON public.gallery;
CREATE POLICY "Admin all access gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all access bookings" ON public.bookings;
CREATE POLICY "Admin all access bookings" ON public.bookings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all access contact_info" ON public.contact_info;
CREATE POLICY "Admin all access contact_info" ON public.contact_info FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all access website_settings" ON public.website_settings;
CREATE POLICY "Admin all access website_settings" ON public.website_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all access testimonials" ON public.testimonials;
CREATE POLICY "Admin all access testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Default Seed Data (Only inserts if the table is empty)
INSERT INTO public.website_settings (website_name, tagline, footer_text, copyright_text)
SELECT 'Jyotirling Connect', 'Premium Pilgrimage Travel', 'Premium devotional travel agency serving pilgrims on their journey between Mahakaleshwar and Omkareshwar.', '© 2024 Jyotirling Connect. All rights reserved.'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);

INSERT INTO public.contact_info (phone_numbers, email, address, business_hours)
SELECT ARRAY['+91 98765 43210'], 'info@jyotirlingconnect.com', 'Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456006', 'Monday - Sunday
9:00 AM - 8:00 PM'
WHERE NOT EXISTS (SELECT 1 FROM public.contact_info);

-- fleet table
CREATE TABLE IF NOT EXISTS public.fleet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    min_passengers INTEGER,
    max_passengers INTEGER,
    perfect_for TEXT[],
    tags TEXT[],
    features TEXT[],
    cover_image TEXT,
    gallery_images TEXT[],
    starting_price NUMERIC,
    price_per_km NUMERIC,
    price_per_day NUMERIC,
    driver_charges NUMERIC,
    display_order INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    show_on_website BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for fleet
ALTER TABLE public.fleet ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (fleet)
DROP POLICY IF EXISTS "Public read access to fleet" ON public.fleet;
CREATE POLICY "Public read access to fleet" ON public.fleet FOR SELECT USING (show_on_website = true);

-- Allow authenticated admins to do all operations on fleet
DROP POLICY IF EXISTS "Admin all access fleet" ON public.fleet;
CREATE POLICY "Admin all access fleet" ON public.fleet FOR ALL USING (auth.role() = 'authenticated');

-- Keep-Alive RPC function
CREATE OR REPLACE FUNCTION public.ping()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'pong'::text;
$$;

-- Grant execute permissions to public roles so it can be called via REST/PostgREST
GRANT EXECUTE ON FUNCTION public.ping() TO anon;
GRANT EXECUTE ON FUNCTION public.ping() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ping() TO service_role;

