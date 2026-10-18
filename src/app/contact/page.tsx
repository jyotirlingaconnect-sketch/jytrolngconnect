import ContactClient from "./ContactClient";
import { supabase } from "@/lib/supabase";
import { contactFaqs } from "@/lib/faqs";
import { JsonLd, breadcrumbJsonLd, businessJsonLd, faqJsonLd } from "@/lib/jsonLd";

export const metadata = {
  title: "Contact Us – Book Ujjain & Omkareshwar Taxi",
  description:
    "Call or WhatsApp +91 6268032441 to book a taxi or tour from Ujjain to Omkareshwar, Maheshwar or Indore, or send an enquiry with your travel dates.",
  alternates: { canonical: "/contact" },
};

// Next.js Revalidation (optional, but good for settings that change rarely)
export const revalidate = 60; 

export default async function ContactPage() {
  const { data: contactInfo } = await supabase.from("contact_info").select("*").limit(1).single();

  return (
    <>
      <JsonLd
        data={[
          businessJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          faqJsonLd(contactFaqs),
        ]}
      />
      <ContactClient contactInfo={contactInfo} />
    </>
  );
}
