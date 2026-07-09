# PROMPT FOR ANTIGRAVITY IDE — "Jyotirling Connect" Website + Admin Dashboard

Copy everything below into Antigravity IDE as your project brief.

---

## PROJECT OVERVIEW

Build a **fully functional, production-ready website** for a travel agency named **"Jyotirling Connect"** that provides bus and taxi services for pilgrims traveling between **Ujjain (Mahakaleshwar Jyotirlinga)** and **Omkareshwar Jyotirlinga**, along with nearby spiritual destinations (Kal Bhairav Temple, ISKCON Ujjain, Ram Ghat, Indore Airport pickup/drop, and other Jyotirlingas on request).

The website must have a **Sanatan Hindu spiritual theme** throughout — visually and tonally devotional, respectful, premium, and trustworthy (this is a pilgrimage service, not a generic taxi app). Think: temple architecture motifs, sacred geometry, saffron/maroon/gold palette, subtle Om/trishul/diya iconography, calm and reverent typography — never gaudy or cartoonish.

This is a **client project** — treat it as a real production deployment, not a demo. Every feature listed below must be fully wired up, tested, and working end-to-end. No placeholder logic, no "TODO" stubs, no broken links, no dead buttons.

---

## TECH STACK

- **Frontend:** React + Next.js (App Router), TypeScript, Tailwind CSS
- **Animation:** Framer Motion + GSAP (ScrollTrigger) for the 3D scrolling animation effects
- **Backend/Database:** Supabase (Postgres) — used for:
  - Storing bookings/enquiries
  - Storing travel packages, gallery images, contact info, website settings (all admin-editable)
  - Supabase Auth for Admin Dashboard login (email/password)
  - Supabase Storage for image uploads (gallery images, package images, logo, favicon)
- **Forms/Validation:** React Hook Form + Zod
- **Notifications:** Toast library (e.g., sonner or react-hot-toast)
- **Image handling:** next/image with compression on upload
- **Hosting-ready:** Environment variables properly configured via `.env.local`, deployable to Vercel


## DESIGN DIRECTION

The site should read as **professional travel-tech first, devotional second** — like a premium hospitality/travel brand (think the polish of a boutique hotel or airline booking site) that happens to be built for a Sanatan pilgrimage route. Avoid anything kitschy, overly ornate, or "temple-flyer" looking. The spiritual feeling should come through **restraint, warmth, and a few well-placed motifs** — not gold borders on every element.

**Signature element:** The light/dark mode toggle itself is a small **diya (oil lamp) icon** — in light mode it shows an unlit/simple lamp outline, in dark mode the flame glows (subtle animated flicker/glow using CSS). This is the one place the site's personality shows a literal devotional touch, and it turns a purely functional UI control into something on-brand.

---

## COLOR SYSTEM

### Light Mode
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FFE5B4` | Page background (as specified) — warm peach/sacred-saffron tone |
| `--surface` | `#FFF6E6` | Cards, modals, nav bar, elevated panels (lighter tint above bg so elevation is visible) |
| `--ink` | `#2B1710` | Primary text — warm espresso-brown, not pure black (softer, warmer than #000) |
| `--ink-muted` | `#6B4A34` | Secondary text, captions, helper text |
| `--accent-primary` | `#A63A1E` | Sindoor red/vermillion — primary buttons, links, active states, key CTAs |
| `--accent-secondary` | `#C89B3C` | Temple brass/gold — icons, borders, badges, dividers, hover accents |
| `--border` | `#E8C896` | Card borders, table lines, input borders |
| `--success` | `#3F7D53` | Confirmation states (booking confirmed, etc.) |
| `--error` | `#B0392A` | Form errors (distinct enough from accent-primary via slightly different weight/usage, not just color alone) |

### Dark Mode
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#1C120B` | Page background — near-black deep maroon-brown ("night temple") |
| `--surface` | `#2A1B10` | Cards, modals, nav bar |
| `--ink` | `#FDEBD3` | Primary text — warm cream |
| `--ink-muted` | `#C9A788` | Secondary text |
| `--accent-primary` | `#E2582D` | Brighter ember/vermillion for contrast on dark backgrounds |
| `--accent-secondary` | `#D4AF6A` | Brighter brass/gold |
| `--border` | `#4A3322` | Card borders, dividers |
| `--success` | `#5FA772` | |
| `--error` | `#E0685A` | |

**Implementation requirements:**
- Implement via CSS custom properties (`:root` and `[data-theme="dark"]`) or Tailwind's `dark:` variant with a `class`-based dark mode strategy — do NOT rely only on `prefers-color-scheme` media query, since users need a manual override.
- Toggle logic: detect system preference (`prefers-color-scheme`) on first visit as the default, then let the user override via the diya-icon toggle in the navbar, and **persist the choice** (localStorage) so it holds across page reloads and page navigations.
- Every single page/section/component must be fully themed in both modes — no hardcoded colors that break in dark mode. Audit: hero canvas overlay gradient, forms, admin dashboard, gallery lightbox, buttons, badges, toasts, modals — all must have a dark-mode equivalent.
- Contrast check: all text/background pairs above must meet **WCAG AA** (4.5:1 for body text, 3:1 for large text/headings) — verify `--ink-muted` on `--bg` in both modes specifically, as muted tones are the most likely to fail contrast.

---

## TYPOGRAPHY

- **Display/Heading font:** **Furonto** (custom font file will be provided separately and added to the project — integrate via `@font-face` / Next.js local font loading, do not substitute a Google Fonts lookalike). Furonto is a confident slab-serif with sturdy strokes — use it for: hero headline, section titles (H1–H3), package titles, and the nav logo wordmark. Use it **sparingly and at size** (28px+) — never for body copy or small UI text, since slab serifs at small sizes hurt readability.
- **Body/UI font:** **Poppins** (Google Font, free, reliable across weights) — used for all body text, navigation links, buttons, form labels, table content, captions. Weights needed: 400 (body), 500 (UI/buttons), 600 (subheadings/emphasis).
- **Type scale** (rem-based, fluid/responsive via `clamp()` where practical):
  - H1 (hero headline): 3rem–4.5rem, Furonto, weight as provided by font file
  - H2 (section titles): 2rem–2.75rem, Furonto
  - H3 (card/subsection titles): 1.25rem–1.5rem, Furonto or Poppins 600 (use Furonto only if it reads cleanly at this size in the actual font file — test and fall back to Poppins 600 if not)
  - Body: 1rem (16px), Poppins 400, line-height 1.6
  - Small/caption: 0.875rem, Poppins 400, `--ink-muted` color
  - Buttons/UI labels: 0.9375rem, Poppins 500, letter-spacing +0.01em
- Do not use more than these two font families anywhere on the site, including the admin dashboard (admin can use a slightly more compact scale but same two fonts, for brand consistency).

---

## COMPONENT STYLE GUIDE

- **Border radius:** Consistent soft rounding — `12px` for cards/inputs/buttons, `20px` for large modals/hero panels, `999px` (pill) only for badges and the theme toggle. Avoid sharp 0px corners (too corporate-cold) and avoid overly bubbly 24px+ on small elements (reads childish).
- **Buttons:**
  - Primary: `--accent-primary` background, `--surface` text, `12px` radius, subtle shadow, hover = slightly darker shade + 2px lift (transform)
  - Secondary/outline: transparent background, `--accent-primary` border + text, fills on hover
  - Ghost/tertiary: text-only with `--accent-secondary` underline on hover (used for nav links)
- **Cards:** `--surface` background, `1px solid --border`, soft shadow (`0 4px 20px rgba(0,0,0,0.06)` light / stronger + warmer-tinted shadow in dark mode), `12–16px` padding, hover = subtle lift + shadow increase for interactive cards (packages, gallery).
- **Icons:** `lucide-react` line icons throughout for UI (nav, buttons, dashboard) — keep consistent 1.5–2px stroke weight. Reserve devotional iconography (diya, Om, temple silhouette, lotus) for illustrated section graphics and the theme toggle only — don't mix devotional icons into generic UI chrome (e.g., don't use a diya icon for a generic "settings" gear).
- **Dividers/motifs:** A subtle repeating temple-arch or lotus-petal line motif (thin, single-color, low-opacity) may be used as a section divider between major homepage sections — use no more than 2–3 times on the page, never as a repeating background texture behind body text (hurts readability and looks templated).
- **Forms:** Floating or top-aligned labels (pick one, stay consistent), `--border` colored input borders that shift to `--accent-primary` on focus, clear inline validation messages in `--error`, visible focus rings for keyboard navigation (accessibility requirement — do not remove default focus outlines without replacing them with an equally visible custom one).
- **Badges:** Pill-shaped, used for "Popular," "Featured," "Available/Unavailable" tags on packages — `--accent-secondary` background with `--ink` text in light mode, inverted appropriately in dark mode.
- **Toasts/notifications:** Top-right or bottom-center, `--surface` background, colored left-border accent (`--success`/`--error`/`--accent-primary` depending on type), auto-dismiss with manual close option.

---

## LAYOUT PRINCIPLES

- Generous whitespace between sections (don't cram content — this is a calming, trust-building site, not a dense dashboard).
- Max content width ~1280px for main content, centered, with full-bleed treatment only for the hero canvas section.
- Section rhythm: alternate `--bg` and `--surface` tinted section backgrounds slightly (very subtle, not high-contrast stripes) to create gentle visual separation down the homepage without hard dividing lines everywhere.
- Mobile-first: stack all multi-column layouts (packages grid, fleet cards, testimonials) to single column below 768px, with the same type scale reduced proportionally (don't just shrink font-size uniformly — reduce H1/H2 more aggressively than body text on mobile).

---

## ADMIN DASHBOARD THEMING NOTE

The admin dashboard should use the **same color tokens and both light/dark modes** (for consistency and because the client will use it daily and may prefer dark mode for evening work) — but with a more compact, data-dense layout (smaller padding, tighter type scale, standard SaaS table/sidebar conventions) rather than the spacious/devotional feel of the public site. Same fonts (Furonto for page titles only, Poppins for everything else in the dashboard).

---

## ACCESSIBILITY & QUALITY BAR
- Full keyboard navigability with visible focus states in both themes.
- Respect `prefers-reduced-motion` — disable the diya-flicker animation, hero canvas parallax extras, and card-hover lift transforms for users with this preference set (the core scroll-scrub hero already has a static fallback per the main prompt).
- All interactive elements have accessible labels (aria-label where icon-only).
- Test both themes against WCAG AA contrast before considering this complete — this is not optional polish, it's a pass/fail requirement.



---

## SUPABASE SCHEMA (create these tables)

1. **`packages`** — id, title, route, destination_name, description, price, vehicle_type, duration, distance, included_services (array), excluded_services (array), pickup_location, drop_location, images (array of URLs), is_featured (bool), is_popular (bool), is_available (bool), created_at, updated_at

2. **`gallery`** — id, image_url, title, description, sort_order, created_at

3. **`bookings`** — id, full_name, phone, email, package_id (FK), travel_date, no_of_passengers, vehicle_preference, pickup_location, drop_location, message, status (pending/confirmed/completed/cancelled), created_at

4. **`contact_info`** — id, phone_numbers (array), whatsapp_number, email, address, google_maps_link, business_hours, additional_contacts (jsonb)

5. **`website_settings`** — id, website_name, tagline, logo_url, favicon_url, footer_text, copyright_text

6. **`testimonials`** — id, name, location, message, rating, image_url, is_approved (bool), created_at

7. **`admin_users`** — handled via Supabase Auth (no custom table needed unless roles are required)

Set up **Row Level Security (RLS)**: public read access for packages/gallery/testimonials/contact_info/website_settings, admin-only write access (authenticated via Supabase Auth), and bookings should allow public insert but admin-only read/update/delete.

---

## PUBLIC WEBSITE — PAGES & SECTIONS

### 1. Home Page
- **Hero section — Scroll-Scrubbed Frame Sequence Animation (NOT an autoplay video):**
  The hero uses a **canvas-based, scroll-driven image-sequence animation** — the same technique used on Apple product pages. A pre-rendered sequence of **240 frames** (a stylized animated journey from Mahakal Temple, Ujjain → Omkareshwar Jyotirlinga, following the Narmada river route) is mapped directly to scroll position.

  **Exact behavior required:**
  - The hero section is pinned (sticky/fixed) for the duration of its scroll range using GSAP ScrollTrigger (`pin: true`).
  - As the user scrolls down through the pinned hero section, the current visible frame advances proportionally to scroll progress (frame 0 at scroll-progress 0%, frame 239 at scroll-progress 100%).
  - **When the user stops scrolling, the animation freezes exactly on the current frame** — no autoplay, no idle looping. It only moves when scroll input moves. This is the core interaction and must feel 1:1 responsive to scroll, not laggy or stepped.
  - Scrolling back up plays the frames in reverse (frame index must be fully reversible, not just forward-only).
  - Implementation: render frames onto an HTML5 `<canvas>` element via `drawImage()`, update the frame index inside a GSAP ScrollTrigger `onUpdate` callback (or scroll listener throttled with `requestAnimationFrame`) — do NOT use a `<video>` element or CSS animation for this, since neither supports true scroll-scrubbing frame-accuracy across browsers.
  - Overlay the "Jyotirling Connect" logo, tagline, and a "Book Your Yatra" CTA button on top of the canvas (fixed position within the pinned hero), with a subtle dark gradient behind the text for legibility across all frames.

  **Frame asset specs (already prepared, use as-is):**
  - 240 frames, WebP format, ~800×450 source resolution (upscale via canvas/CSS to fill viewport, or request 1920×1080 re-render later for crisper large screens), ~22KB per frame, ~5.3MB total sequence.
  - Frames must be named in strict sequential order (`frame_000.webp` → `frame_239.webp`) so they can be indexed programmatically.

  **Performance requirements (critical — do not skip):**
  - Preload all 240 frames before enabling scroll-scrub interaction; show a loading indicator (branded, temple-themed spinner or progress bar) until preload completes, since scrubbing through unloaded frames will show blank/flicker.
  - Use an `Image()` preload pool or a small preloader utility — cache decoded frames so `drawImage()` calls don't re-decode WebP on every scroll tick.
  - Throttle scroll-to-frame updates with `requestAnimationFrame` (never update canvas directly inside a raw unthrottled scroll event).
  - On mobile: canvas dimensions must scale to device pixel ratio without re-decoding all frames at full res unnecessarily — use a capped `devicePixelRatio` (e.g., max 2x) for the canvas backing store to control memory/performance.
  - Provide a static fallback (first frame, no scrub interaction) for browsers/devices with reduced-motion preference (`prefers-reduced-motion: reduce`) or very low-end devices — detect and gracefully degrade.

- **3D scroll animation (rest of page):** After the pinned hero sequence completes (scroll progress reaches 100% and unpins), continue with parallax/3D depth effects for the sections below — layered temple silhouettes, floating diyas, subtle particle effects (floating marigold petals or light rays), and scroll-triggered reveal animations for each section (using GSAP ScrollTrigger + Framer Motion). Keep it smooth, performant (60fps), and not overwhelming — should feel divine and premium, not like a video game.
- **Route highlight section**: Ujjain ↔ Omkareshwar with an animated route/map illustration
- **Why Choose Us** section (brief teaser, links to full Why Us page)
- **Featured Packages** carousel (pulled dynamically from Supabase `packages` table where `is_featured = true`)
- **Testimonials** carousel (dynamic from Supabase)
- **CTA banner** before footer: "Plan Your Spiritual Journey Today"

### 2. About Us Page
Draft complete, ready-to-use content (client can edit later) covering: agency's mission to serve pilgrims, years of experience (use placeholder "X+ years"), commitment to safety/comfort/devotion, values rooted in Sanatan Dharma hospitality (Atithi Devo Bhava). Include a stylized illustration section, not real photos.

### 3. Services / Fleet Page
Display all vehicle categories with illustrated icons/graphics (not real photos — stylized):
- **Sedan** (4 seater) — for couples/small families
- **SUV** (6-7 seater) — for small groups
- **Tempo Traveller** (12-17 seater) — for medium groups
- **Mini Bus** (20-25 seater) — for large groups
- **Luxury Bus** (35-45 seater) — for big pilgrimage groups/tours
Each card: seating capacity, ideal-for description, "Contact for Quote" pricing badge, and a "Select This Vehicle" button linking to the booking form.

### 4. Packages Page
Dynamically list all packages from Supabase, with filters for:
- **Trip type**: One-Way / Round-Trip / Full-Day / Multi-Day Pilgrimage Package
- **Vehicle type**
- **Destination** (Mahakaleshwar, Omkareshwar, Kal Bhairav, ISKCON Ujjain, Indore Airport, Custom Jyotirlinga tours)
Each package card shows image, title, route, duration, "Contact for Quote," and "Book Now" button. Package detail page (dynamic route `/packages/[id]`) showing full itinerary, inclusions/exclusions, pickup/drop points, and booking form.

### 5. Booking / Enquiry Page
Full real booking system:
- Date picker (travel date)
- Vehicle selection dropdown
- Package selection (optional, pre-filled if coming from a package page)
- Number of passengers
- Pickup & drop location fields
- Full name, phone, email
- Additional message/special requirements
- On submit: insert into Supabase `bookings` table, show success toast, send confirmation (client-side email trigger via Supabase Edge Function + Resend/SendGrid, or at minimum a clear on-screen confirmation with booking reference number)
- Form validation via Zod (required fields, phone format, future-date-only restriction)

### 6. Gallery Page
Dynamic gallery pulled from Supabase `gallery` table, masonry/grid layout, lightbox on click, illustrated/stylized placeholder images (Antigravity should generate/use placeholder illustrated graphics of temples, routes, vehicles — clearly marked as placeholders for client to replace).

### 7. Testimonials Page
Dynamic list from Supabase, star ratings, pilgrim name + location, drafted with 6-8 realistic placeholder testimonials about the Ujjain-Omkareshwar journey experience.

### 8. Why Us Page
Draft content covering: experienced drivers familiar with pilgrimage routes, clean/sanitized vehicles, flexible packages, 24/7 support, transparent process, devotional hospitality, safety-first approach, on-time darshan scheduling assistance (helping pilgrims time their visit for aarti/darshan slots).

### 9. Contact Page
Dynamic contact info from Supabase `contact_info` table — phone (click-to-call), WhatsApp (click-to-chat with pre-filled message), email, office address, embedded Google Map, business hours, and a general contact form (separate from booking form) that also inserts into Supabase.

### 10. Privacy Policy Page
Draft a complete, standard privacy policy covering: what data is collected (name, phone, email, booking details), how it's used (only for booking/communication purposes), third-party sharing (none, except payment/communication providers if added later), cookie usage, user rights, contact for data queries. Written in plain, client-appropriate legal language (not a lawyer-certified document, but production-acceptable boilerplate).

### Global Elements
- **Navbar**: Sticky, transparent-to-solid on scroll, with logo, nav links, and "Book Now" CTA button. Mobile: hamburger menu with smooth slide-in.
- **Footer**: Dynamic (from `website_settings` table) — logo, tagline, quick links, contact snippet, social icons (placeholder links), copyright text, "Privacy Policy" link.
- **WhatsApp floating button**: Fixed bottom-right, links to WhatsApp with pre-filled enquiry message.
- **Loading states**: Skeleton loaders for all dynamic content sections.
- **SEO**: Proper meta tags, Open Graph tags, sitemap.xml, robots.txt — for keywords like "Ujjain to Omkareshwar taxi," "Mahakal Omkareshwar bus service," "Jyotirlinga yatra travel."
- **Fully responsive**: Mobile-first, tested for mobile/tablet/desktop breakpoints.

---

## ADMIN DASHBOARD (full spec — build exactly as follows)

Build a **complete, production-ready Admin Dashboard** at `/admin` route, fully connected to Supabase, so the client can manage the entire website without touching code. Every change saved in the dashboard must reflect live on the public site immediately (via Supabase real-time data fetching, no caching issues).

### Authentication & Security
- Secure login page (`/admin/login`) using Supabase Auth (email/password)
- Protected routes: all `/admin/*` routes redirect to login if unauthenticated (middleware-based route protection)
- Session persistence and proper logout functionality
- Route guards so unauthorized users cannot access admin API routes or Supabase tables (enforced via RLS policies, not just frontend checks)
- Form validation on login (email format, required fields, error messages on wrong credentials)

### 1. Dashboard Home / Overview
- Sidebar navigation with icons (use lucide-react icons) for: Dashboard, Packages, Gallery, Bookings/Enquiries, Testimonials, Contact Info, Website Settings, Logout
- Top stat cards: Total Packages, Total Gallery Images, Total Bookings/Enquiries (with pending count highlighted), Total Testimonials
- "Recent Activity" feed showing last 5-10 bookings/enquiries with timestamp
- Fully responsive: sidebar collapses to a bottom nav or hamburger drawer on mobile

### 2. Website Settings Module
Form to edit (all fields pre-filled from Supabase, save button with validation + success/error toast):
- Website name
- Tagline
- Logo upload (drag-and-drop, preview before save, replaces existing in Supabase Storage)
- Favicon upload
- Footer text
- Copyright text

### 3. Contact Info Module
Form to edit:
- Multiple phone numbers (add/remove dynamically)
- WhatsApp number
- Email address
- Office address
- Google Maps embed link
- Business hours
- Additional contact entries (dynamic key-value list, add/remove)
All changes reflect instantly on the public Contact page.

### 4. Gallery Management Module
- Drag-and-drop multi-image upload area with live preview before publishing
- Auto image compression on upload (client-side, before pushing to Supabase Storage)
- Edit title/description per image
- Drag-and-drop reordering (updates `sort_order` field)
- Delete image (with confirmation dialog)
- Replace existing image
- Upload progress bar + success/error toast per file

### 5. Package Management Module (Full CRUD)
Table view with search, filter (by trip type/vehicle/availability), and sort (by date created, price, popularity).
- **Add New Package** form with all fields: title, route, destination, description (rich text or textarea), price, vehicle type (dropdown), duration, distance, included services (tag input), excluded services (tag input), pickup location, drop location, multiple image upload, "Featured" toggle, "Popular/Recommended" badge toggle, availability status toggle
- **Edit** existing package (same form, pre-filled)
- **Delete** with confirmation dialog
- **Duplicate** package (clones all fields as a new draft)
- **Hide/Show** toggle (sets `is_available`)
- All actions update Supabase instantly and reflect on public Packages page

### 6. Bookings/Enquiries Module
- Table of all bookings from Supabase: name, phone, email, package, travel date, passengers, status
- Filter by status (pending/confirmed/completed/cancelled) and date range
- Click a row to view full enquiry details in a modal
- Update status dropdown (with toast confirmation)
- Export to CSV button
- Delete enquiry (with confirmation dialog)

### 7. Testimonials Module
- Table/grid of testimonials with approve/reject toggle (`is_approved`) — only approved testimonials show on public site
- Add new testimonial manually (name, location, message, rating, image)
- Edit/Delete existing

### UX Requirements (apply across entire dashboard)
- Toast notifications for every create/update/delete action (success and error states)
- Confirmation dialogs before any delete action
- Loading skeletons/spinners during data fetch
- Smooth page transitions between admin sections
- Consistent card/table/form design system matching Tailwind config used on public site (but with a clean, neutral "SaaS admin" look — white/light background, sidebar dark, is fine here even though public site is devotional-themed)
- Fully responsive: dashboard must work on tablets and mobile for on-the-go management

### Performance & Code Quality
- Lazy-load images throughout (gallery, packages)
- Optimize Supabase queries (select only needed columns, use indexes on frequently filtered columns like `status`, `is_available`, `is_featured`)
- Modular component architecture: reusable `<DataTable>`, `<ImageUploader>`, `<ConfirmDialog>`, `<FormField>` components shared across modules
- TypeScript types generated from Supabase schema for full type safety
- No breaking changes to public site when admin modules are added — admin and public share the same Supabase client but separate route groups (`(public)` and `admin`)
- Test every CRUD operation end-to-end before considering this complete: create → verify it appears on public site → edit → verify update reflects → delete → verify removal reflects

---

## IMAGE PLACEHOLDER STRATEGY
Since real photos aren't available yet, generate/use **illustrated, stylized placeholder graphics** (flat/semi-flat illustration style, saffron-gold-maroon palette matching site theme) for:
- Logo (simple dummy Om/temple-silhouette mark with text "Jyotirling Connect")
- Vehicle illustrations (Sedan, SUV, Tempo Traveller, Mini Bus, Luxury Bus)
- Temple illustrations (Mahakaleshwar, Omkareshwar)
- Gallery placeholder images (route scenery, temple exteriors, devotees, diyas)
Clearly comment in code where these are placeholders so the client can swap them later with real photos without touching layout code.

---

## FINAL INSTRUCTION
Do not stop until: the public website is fully built and responsive, all pages are dynamically connected to Supabase where specified, the 3D scroll animation is smooth and performant, the Admin Dashboard is fully functional with every CRUD module working and tested end-to-end, authentication is secure, and the entire project is production-ready for deployment with no placeholder logic left unimplemented (only placeholder *visual assets* like logo/images are acceptable, not placeholder *functionality*).
