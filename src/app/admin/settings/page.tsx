"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface WebsiteSettings {
  id: string;
  website_name?: string;
  tagline?: string;
  logo_url?: string;
  favicon_url?: string;
  footer_text?: string;
  copyright_text?: string;
}

import { ImageUploadArea } from "@/components/ImageUploadArea";

interface ContactInfo {
  id: string;
  phone_numbers?: string[];
  email?: string;
  address?: string;
  business_hours?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Website Settings
      let { data: settingsData } = await supabase.from("website_settings").select("*").limit(1).single();
      if (!settingsData) {
        const initialSettings = { website_name: "Jyotirling Connect", tagline: "Premium Pilgrimage Travel" };
        const { data } = await supabase.from("website_settings").insert([initialSettings]).select().single();
        settingsData = data;
      }
      
      // Fetch Contact Info
      let { data: contactData } = await supabase.from("contact_info").select("*").limit(1).single();
      if (!contactData) {
        const initialContact = {
          phone_numbers: ["+91 98765 43210"],
          email: "info@jyotirlingconnect.com",
          address: "Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456006",
          business_hours: "Monday - Sunday\n9:00 AM - 8:00 PM"
        };
        const { data } = await supabase.from("contact_info").insert([initialContact]).select().single();
        contactData = data;
      }

      setSettings(settingsData);
      setContact(contactData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    // Website Settings Updates
    const settingsUpdates = {
      website_name: formData.get("website_name"),
      tagline: formData.get("tagline"),
      logo_url: settings?.logo_url || null,
      footer_text: formData.get("footer_text"),
      copyright_text: formData.get("copyright_text"),
    };

    // Contact Info Updates
    const contactUpdates = {
      phone_numbers: [(formData.get("phone") as string) || ""],
      email: formData.get("email"),
      address: formData.get("address"),
      business_hours: formData.get("business_hours"),
    };

    try {
      if (settings?.id) {
        const { error } = await supabase.from("website_settings").update(settingsUpdates).eq("id", settings.id);
        if (error) throw error;
      }
      if (contact?.id) {
        const { error } = await supabase.from("contact_info").update(contactUpdates).eq("id", contact.id);
        if (error) throw error;
      }
      toast.success("Settings updated successfully");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update settings";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink mb-2">Website Settings</h1>
        <p className="text-ink-muted">Manage global website configuration and contact details</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="font-bold text-ink text-lg">General Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="website_name">Website Name *</Label>
                <Input id="website_name" name="website_name" defaultValue={settings?.website_name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" name="tagline" defaultValue={settings?.tagline} />
              </div>
              <div className="space-y-2 pt-2">
                <Label>Website Logo</Label>
                <ImageUploadArea
                  value={settings?.logo_url || ""}
                  onChange={(url) => setSettings(prev => prev ? { ...prev, logo_url: url as string } : null)}
                  folder="settings"
                />
              </div>
              
              <div className="pt-4 border-t border-border space-y-4">
                <h3 className="font-bold text-ink text-lg">Footer Text</h3>
                <div className="space-y-2">
                  <Label htmlFor="footer_text">Footer About Text</Label>
                  <Textarea id="footer_text" name="footer_text" defaultValue={settings?.footer_text} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyright_text">Copyright Text</Label>
                  <Input id="copyright_text" name="copyright_text" defaultValue={settings?.copyright_text} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="font-bold text-ink text-lg">Contact Information</h3>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={contact?.phone_numbers?.[0] || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" defaultValue={contact?.email} type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Textarea id="address" name="address" defaultValue={contact?.address} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_hours">Business Hours</Label>
                <Textarea id="business_hours" name="business_hours" defaultValue={contact?.business_hours} rows={2} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" className="w-full md:w-auto px-12">
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
