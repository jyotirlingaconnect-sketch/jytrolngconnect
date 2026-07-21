<div align="center">

# 🕉️ Jyotirling Connect

### Premium Pilgrimage & Luxury Travel Booking Platform

<p align="center">
A modern Full Stack Travel Management Platform built with Next.js, TypeScript, Supabase and Vercel.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

</div>

---

## 🌐 Live Demo

**Website**

https://your-domain.com

**Admin Dashboard**

https://your-domain.com/admin

---

## 📸 Preview

> Add screenshots or GIFs here.

| Home Page | Fleet |
|------------|-------|
| Screenshot | Screenshot |

| Booking | Dashboard |
|-----------|-----------|
| Screenshot | Screenshot |

---

# ✨ Features

## 🌍 Website

- Beautiful Landing Page
- 3D Scroll Hero Animation (GSAP)
- Premium Glassmorphism UI
- Fully Responsive Design
- Light & Dark Mode
- Fleet Booking
- Dynamic Packages
- Dynamic Gallery
- History Page
- About Us
- Contact Us
- Terms & Conditions
- VIP Darshan Information
- Hindi Language Support
- SEO Optimized

---

## 🚗 Fleet Booking

- Dynamic Fleet
- Multiple Vehicle Categories
- Dynamic Images
- Fleet Gallery
- Vehicle Tags
- Passenger Capacity
- Booking Integration

---

## 📦 Package Booking

- Dynamic Packages
- Multiple Day Itineraries
- Pricing
- Vehicle Selection
- Journey Details
- Admin Controlled

---

## 📷 Gallery

- Masonry Layout
- Random Image Arrangement
- Dynamic Images
- Lightbox Preview
- Responsive Gallery

---

## 🛕 History Module

- Temple History
- Local Stories
- Architecture
- Original Images
- Hindi Language Toggle

---

## 👨‍💼 Admin Dashboard

Complete CMS

### Dashboard

- Analytics
- Charts
- KPI Cards
- Recent Bookings
- Quick Actions

### Fleet Management

- Add Fleet
- Edit Fleet
- Delete Fleet
- Multiple Images
- Vehicle Tags
- Passenger Capacity

### Package Management

- Dynamic Itinerary
- Day-wise Plans
- Dynamic Pricing
- Multiple Images

### Gallery

- Upload Images
- Delete Images
- Auto Sync Website

### Website Settings

- Hero Images
- Contact Details
- Social Links
- Branding

---

# 🚀 Tech Stack

## Frontend

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Lottie

---

## Backend

- Supabase
- PostgreSQL
- Row Level Security
- Storage URLs

---

## Storage

- Vercel Blob Storage

---

## Charts

- Recharts

---

## Forms

- React Hook Form
- Zod Validation

---

# 🏗 Project Architecture

```
Admin Dashboard
       │
       ▼
Upload Images
       │
       ▼
Vercel Blob Storage
       │
       ▼
Image URL
       │
       ▼
Supabase Database
       │
       ▼
Website
```

---

# 📂 Folder Structure

```
src
│
├── app
│
├── components
│
├── hooks
│
├── lib
│
├── services
│
├── types
│
├── styles
│
└── utils

public
│
├── images
├── lottie
├── frames
└── icons

supabase
│
├── schema.sql
├── migrations
└── policies
```

---

# 🗄 Database

Main Tables

- bookings
- fleet
- packages
- gallery
- contact_info
- website_settings
- testimonials
- users

---

# ⏰ Supabase Keep-Alive

### Preventing Database Pausing on Free Tier

Supabase's Free Tier projects automatically pause after 1 week of inactivity. To prevent this project's database from sleeping, an automated keep-alive system is integrated using GitHub Actions.

#### How It Works
The keep-alive system calls a custom Postgres function (RPC) `ping()` in the Supabase database. Calling this RPC runs a real lightweight SQL command inside the database engine, generating activity and keeping the database active without altering any production data.
- **Workflow Action**: Calls the `ping()` RPC endpoint via a lightweight Node.js script.
- **RPC Function**: `public.ping()` returns `'pong'` and executes with `SECURITY DEFINER` privileges.
- **Side Effects**: None.

#### Workflow Schedule
- Runs automatically **every 5 days** at 00:00 UTC.
- Can be manually executed at any time.

#### Required GitHub Secrets
The workflow uses the following Repository Secrets (configured in Settings > Secrets and variables > Actions):
- `SUPABASE_URL`: The URL of your Supabase project (e.g., `https://your-project-id.supabase.co`).
- `SUPABASE_ANON_KEY`: The API key associated with your Supabase project (the Client/Anon key).

#### How to Manually Trigger the Workflow
1. Go to the **Actions** tab in your GitHub repository.
2. Select **Supabase Keep-Alive** from the workflows list on the left.
3. Click the **Run workflow** dropdown menu on the right.
4. Select the target branch and click the green **Run workflow** button.

#### How to Modify the Schedule
To change the cron schedule, edit [.github/workflows/supabase-keepalive.yml](file:///.github/workflows/supabase-keepalive.yml):
```yaml
on:
  schedule:
    # Example: Run every 3 days instead of 5 days:
    - cron: '0 0 */3 * *'
```

---

# 🔒 Security

- Supabase Authentication
- Protected Admin Routes
- Row Level Security
- Secure Image Upload
- Environment Variables
- Vercel Blob Storage
- Input Validation
- Zod Validation

---

# ⚡ Performance

- Image Optimization
- Lazy Loading
- Code Splitting
- Dynamic Imports
- Responsive Images
- Optimized Animations
- Lighthouse Friendly

---

# 📱 Responsive

Supports

- Mobile
- Tablet
- Laptop
- Desktop
- Ultra Wide Screens

Compatible with

- Chrome
- Edge
- Firefox
- Safari

---

# ⚙ Installation

Clone Repository

```bash
git clone https://github.com/jyotirlingaconnect-sketch/jytrolngconnect.git
```

Install Dependencies

```bash
npm install
```

Create

```
.env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

BLOB_READ_WRITE_TOKEN=
```

Run Project

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

# 🚀 Deployment

Frontend

- Vercel

Backend

- Supabase

Storage

- Vercel Blob

---

# 🛣 Roadmap

- Driver Management
- Payment Gateway
- Live Vehicle Tracking
- Push Notifications
- Reviews & Ratings
- AI Trip Planner
- Coupons
- Analytics Dashboard
- Driver Mobile App

---

# 🤝 Contributing

Contributions are welcome.

1. Fork Repository

2. Create Branch

3. Commit Changes

4. Push Branch

5. Open Pull Request

---

# 👨‍💻 Author

**Animesh Ansh Yadav**  
*Full Stack Developer*

- 📧 **Email:** [animeshansh10@gmail.com](mailto:animeshansh10@gmail.com)
- 🐙 **GitHub:** [@siefer2005](https://github.com/siefer2005)
- 💼 **LinkedIn:** [Add LinkedIn URL](#)
- 🌐 **Portfolio:** [Add Portfolio URL](#)

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub. It really helps!

---

<div align="center">
  <p>Made with ❤️ using</p>
  <p><b>Next.js • Supabase • TypeScript • TailwindCSS • GSAP • Framer Motion</b></p>
</div>