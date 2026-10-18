import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProviders } from "@/components/auth/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const furonto = localFont({
  src: "../../public/fonts/FurontoRegular.otf",
  variable: "--font-furonto",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jyotirlingconnect.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C8B091" },
    { media: "(prefers-color-scheme: dark)", color: "#2A1B10" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ujjain to Omkareshwar Taxi & Jyotirlinga Tour Packages | Jyotirling Connect",
    template: "%s | Jyotirling Connect",
  },
  description:
    "Private AC taxi, Innova Crysta and tempo traveller from Ujjain to Omkareshwar, Maheshwar, Mandu and Indore. Jyotirlinga day trips and tour packages with per-vehicle prices.",
  keywords: [
    "Jyotirling Connect",
    "Mahakaleshwar",
    "Omkareshwar",
    "pilgrimage travel",
    "Ujjain taxi",
    "Omkareshwar tour",
    "Jyotirlinga yatra",
    "devotional travel",
    "spiritual journey",
    "temple taxi",
  ],
  authors: [{ name: "Jyotirling Connect" }],
  creator: "Jyotirling Connect",
  publisher: "Jyotirling Connect",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Jyotirling Connect",
    title: "Ujjain to Omkareshwar Taxi & Jyotirlinga Tour Packages | Jyotirling Connect",
    description:
      "Private AC taxi, Innova Crysta and tempo traveller from Ujjain to Omkareshwar, Maheshwar, Mandu and Indore.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ujjain to Omkareshwar Taxi & Jyotirlinga Tour Packages | Jyotirling Connect",
    description:
      "Private AC taxi, Innova Crysta and tempo traveller from Ujjain to Omkareshwar, Maheshwar, Mandu and Indore.",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload first frame for instant hero render */}
        <link rel="preload" as="image" href="/frames/frame_000.webp" fetchPriority="high" />
      </head>
      <body
        className={`${poppins.variable} ${furonto.variable} antialiased min-h-[100dvh] flex flex-col overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProviders>
            {children}
          </AuthProviders>
          <Toaster richColors position="top-right" />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
