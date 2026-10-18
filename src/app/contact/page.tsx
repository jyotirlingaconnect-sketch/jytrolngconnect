import ContactClient from "./ContactClient";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Contact Us – Book Ujjain & Omkareshwar Taxi",
  description:
    "Get in touch with Jyotirling Connect for your premium spiritual journey between Mahakaleshwar and Omkareshwar.",
  alternates: { canonical: "/contact" },
};

// Next.js Revalidation (optional, but good for settings that change rarely)
export const revalidate = 60; 

export default async function ContactPage() {
  const { data: contactInfo } = await supabase.from("contact_info").select("*").limit(1).single();

  return <ContactClient contactInfo={contactInfo} />;
}
