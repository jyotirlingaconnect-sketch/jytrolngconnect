import TermsClient, { type TermsClientProps } from "@/app/terms-conditions/TermsClient";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Terms & Conditions | Jyotirling Connect",
  description:
    "Read the terms and conditions for booking your premium pilgrimage journey with Jyotirling Connect.",
};

export const revalidate = 60;

export default async function TermsConditionsPage() {
  const { data: contactInfo } = await supabase
    .from("contact_info")
    .select("phone_numbers, email, address, business_hours")
    .limit(1)
    .single();

  return <TermsClient contactInfo={contactInfo satisfies TermsClientProps["contactInfo"]} />;
}
