import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FleetClient } from "./FleetClient";

export const metadata = {
  title: "Premium Fleet | Jyotirling Connect",
  description: "Explore our premium fleet of vehicles including Maruti Suzuki Ertiga, Toyota Innova Crysta, Force Traveller, and Luxury Buses for your Jyotirlinga Yatra.",
};

export default function FleetPage() {
  return (
    <>
      <Navbar />
      <FleetClient />
      <Footer />
    </>
  );
}
