"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ContactInfo {
  phone_numbers?: string[];
  email?: string;
  address?: string;
}

interface WebsiteSettings {
  website_name?: string;
  tagline?: string;
  logo_url?: string;
  copyright_text?: string;
}

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    async function fetchFooterData() {
      const { data: contact } = await supabase.from("contact_info").select("*").limit(1).single();
      if (contact) setContactInfo(contact);

      const { data: settings } = await supabase.from("website_settings").select("*").limit(1).single();
      if (settings) setWebsiteSettings(settings);
    }
    fetchFooterData();
  }, []);

  const phone = contactInfo?.phone_numbers?.[0] || "+91 98765 43210";
  const email = contactInfo?.email || "info@jyotirlingconnect.com";
  const address = contactInfo?.address || "Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456006";
  
  const websiteName = websiteSettings?.website_name || "Jyotirling Connect";
  const tagline = websiteSettings?.tagline || "Premium devotional travel agency serving pilgrims on their journey between Mahakaleshwar and Omkareshwar.";
  const copyright = websiteSettings?.copyright_text || `© ${new Date().getFullYear()} ${websiteName}. All rights reserved.`;

  return (
    <footer className="bg-section-bg transition-colors duration-700 border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              {websiteSettings?.logo_url ? (
                <img src={websiteSettings.logo_url} alt={websiteName} className="h-8 w-auto object-contain" />
              ) : (
                <div className="text-2xl font-display font-bold text-accent-primary">
                  {websiteName.replace("Connect", "")}<span className="text-ink">Connect</span>
                </div>
              )}
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed whitespace-pre-line">
              {tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-ink">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Fleet", href: "/fleet" },
                { label: "Packages", href: "/packages" },
                { label: "Gallery", href: "/gallery" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ink-muted hover:text-accent-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-ink">Support</h4>
            <ul className="space-y-2">
              {["Contact Us", "Privacy Policy", "Terms & Conditions"].map((link) => (
                <li key={link}>
                  <Link
                    href={link === "Contact Us" ? "/contact" : `/${link.toLowerCase().replace(/ & /g, "-").replace(" ", "-")}`}
                    className="text-ink-muted hover:text-accent-primary text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-ink">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-ink-muted">
                <MapPin size={18} className="text-accent-primary shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-muted">
                <Phone size={18} className="text-accent-primary shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-accent-primary transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-muted">
                <Mail size={18} className="text-accent-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-accent-primary transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-muted">
            {copyright}
          </p>
          <div className="flex items-center gap-4 text-sm text-ink-muted">
            <span>Atithi Devo Bhava</span>
            <span className="text-accent-secondary">ॐ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
