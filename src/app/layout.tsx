import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
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
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jyotirling Connect | Premium Pilgrimage Travel",
    template: "%s | Jyotirling Connect",
  },
  description:
    "Premium devotional bus and taxi services for pilgrims traveling between Mahakaleshwar and Omkareshwar Jyotirlinga. Book your spiritual yatra with experienced, verified drivers.",
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
    title: "Jyotirling Connect | Premium Pilgrimage Travel",
    description:
      "Premium devotional bus and taxi services for pilgrims traveling between Mahakaleshwar and Omkareshwar Jyotirlinga. Book your yatra today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jyotirling Connect — Premium Pilgrimage Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyotirling Connect | Premium Pilgrimage Travel",
    description:
      "Premium devotional bus and taxi services for pilgrims traveling between Mahakaleshwar and Omkareshwar Jyotirlinga.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
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
      <body
        className={`${poppins.variable} ${furonto.variable} antialiased min-h-[100dvh] flex flex-col overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
