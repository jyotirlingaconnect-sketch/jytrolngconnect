import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const furonto = localFont({
  src: "../../public/fonts/FurontoRegular.otf",
  variable: "--font-furonto",
});

export const metadata: Metadata = {
  title: "Jyotirling Connect | Premium Pilgrimage Travel",
  description: "Devotional bus and taxi services for pilgrims traveling between Mahakaleshwar and Omkareshwar Jyotirlinga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${furonto.variable} antialiased min-h-[100dvh] flex flex-col overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

