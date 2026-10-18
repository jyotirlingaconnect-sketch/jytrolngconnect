import AboutClient from "./AboutClient";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonLd";

export const metadata = {
  title: "About Us – Ujjain Pilgrimage Travel Agency",
  description:
    "Jyotirling Connect is an Ujjain-based pilgrimage travel service running private taxis and tours between Mahakaleshwar, Omkareshwar, Maheshwar and Indore.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutClient />
    </>
  );
}
