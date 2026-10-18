import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Ujjain & Omkareshwar Taxi",
  description:
    "Book a taxi, tempo traveller or bus for your Mahakaleshwar and Omkareshwar Jyotirlinga yatra. Verified drivers, comfortable vehicles and quick confirmation.",
  alternates: { canonical: "/booking" },
};

export default function BookingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
