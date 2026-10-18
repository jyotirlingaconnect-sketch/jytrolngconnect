import type { Metadata } from "next";
import { BookingClient } from "./BookingClient";

export const metadata: Metadata = {
  title: "Book an Ujjain Taxi or Omkareshwar Tour",
  description:
    "Book a private AC taxi, Innova Crysta or tempo traveller from Ujjain or Indore to Omkareshwar, Maheshwar and Mandu. Send your dates and we confirm on call or WhatsApp.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  return <BookingClient />;
}
