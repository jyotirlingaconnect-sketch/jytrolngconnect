import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FleetClient } from "./FleetClient";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonLd";

export const metadata = {
  title: "Ujjain Taxi & Tempo Traveller Fleet",
  description:
    "Hire a Maruti Ertiga, Toyota Innova Crysta, Force Tempo Traveller or tourist bus with driver in Ujjain for Omkareshwar, Maheshwar and Indore trips. Private AC vehicles.",
  alternates: { canonical: "/fleet" },
};

export default function FleetPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
        ])}
      />
      <Navbar />
      <FleetClient />
      <Footer />
    </>
  );
}
