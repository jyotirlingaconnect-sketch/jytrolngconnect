"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminContactInfoPage() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("contact_info").select("*").limit(1).single();
      if (data) {
        setContactInfo(data);
      } else {
        const initial = { 
          phone_numbers: ["+91 98765 43210"], 
          email: "info@jyotirlingconnect.com",
          whatsapp_number: "+919876543210",
        };
        await supabase.from("contact_info").insert([initial]);
        setContactInfo(initial);
      }
      setLoading(false);
    };
    fetchContactInfo();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const updates = {
      phone_numbers: [formData.get("phone")],
      whatsapp_number: formData.get("whatsapp"),
      email: formData.get("email"),
      address: formData.get("address"),
      business_hours: formData.get("hours"),
      google_maps_link: formData.get("maps_link"),
    };

    if (contactInfo?.id) {
      const { error } = await supabase.from("contact_info").update(updates).eq("id", contactInfo.id);
      if (error) toast.error(error.message);
      else toast.success("Contact info updated successfully");
    }
    setSaving(false);
  };

  if (loading) return <div className="py-8">Loading contact info...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink mb-2">Contact Information</h1>
        <p className="text-ink-muted">Manage the contact details shown on the website</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Primary Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={contactInfo?.phone_numbers?.[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (for chat link)</Label>
                <Input id="whatsapp" name="whatsapp" defaultValue={contactInfo?.whatsapp_number} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={contactInfo?.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Office Address</Label>
              <Textarea id="address" name="address" defaultValue={contactInfo?.address} className="min-h-[80px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Business Hours</Label>
                <Input id="hours" name="hours" defaultValue={contactInfo?.business_hours} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maps_link">Google Maps Link</Label>
                <Input id="maps_link" name="maps_link" defaultValue={contactInfo?.google_maps_link} />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Contact Info"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
