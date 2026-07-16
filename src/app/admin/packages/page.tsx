"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, X, Search, ChevronDown,
  Package, MapPin, Clock, Car, Users, Star,
  Eye, EyeOff, TrendingUp, Award,
  Calendar, Moon, DollarSign,
  Save, Loader2, Check, Info, Tag, Globe,
  Image as ImageIcon, Hash, LayoutGrid,
  RefreshCw, Luggage, BadgeCheck, Flame, CircleCheck,
  CarFront, Bus, BusFront, Hotel, Coffee, Utensils, UtensilsCrossed,
  ParkingCircle, MapPinned, Route, UserRound, Fuel, BriefcaseMedical, Droplets, Mountain,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploadArea } from "@/components/ImageUploadArea";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  notes: string;
  places: string[];
}

export interface PricingOption {
  persons: number;
  price: number;
  discount_price?: number;
}

export interface PackageData {
  id: string;
  title: string;
  name?: string;
  route?: string;
  description?: string;
  price?: number; // Kept for legacy/starting price
  per_person_price?: number;
  vehicle_price?: number;
  discount_price?: number;
  vehicle_type?: string;
  duration?: string;
  distance?: string;
  days?: number;
  nights?: number;
  seating_capacity?: number;
  is_ac?: boolean;
  luggage_capacity?: string;
  start_destination?: string;
  places_to_visit?: string[];
  days_itinerary?: DayItinerary[];
  pricing_options?: PricingOption[];
  package_highlights?: string[];
  included_facilities?: string[];
  cover_image?: string;
  gallery_images?: string[];
  images?: string[];
  is_available?: boolean;
  is_popular?: boolean;
  is_featured?: boolean;
  is_recommended?: boolean;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  created_at?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLACES_OPTIONS = [
  "Ujjain", "Ujjain Sightseeing", "Mahakaleshwar Temple",
  "Kal Bhairav Temple", "Harsiddhi Temple", "Ram Ghat",
  "Omkareshwar", "Mamleshwar Temple", "Narmada Ghat Aarti", "Maheshwar", "Mandu",
  "Indore", "Khajrana Ganesh Temple", "Annapurna Temple",
  "Lal Bagh Palace", "Sarafa Bazaar",
];

const FACILITIES = [
  { id: "Hotel", icon: Hotel },
  { id: "Breakfast", icon: Coffee },
  { id: "Lunch", icon: Utensils },
  { id: "Dinner", icon: UtensilsCrossed },
  { id: "Parking", icon: ParkingCircle },
  { id: "Guide", icon: MapPinned },
  { id: "VIP Darshan", icon: BadgeCheck },
  { id: "Toll Tax", icon: Route },
  { id: "Driver Charges", icon: UserRound },
  { id: "Fuel Charges", icon: Fuel },
  { id: "Medical Kit", icon: BriefcaseMedical },
  { id: "Water Bottle", icon: Droplets },
];

const VEHICLE_TYPES = [
  { id: "Sedan", label: "Sedan", icon: CarFront, desc: "4+1 Seater" },
  { id: "SUV", label: "SUV", icon: Car, desc: "6+1 Seater" },
  { id: "Tempo Traveller", label: "Tempo Traveller", icon: BusFront, desc: "9–14 Seater" },
  { id: "Mini Bus", label: "Mini Bus", icon: Bus, desc: "20–25 Seater" },
  { id: "Luxury Bus", label: "Luxury Bus", icon: Bus, desc: "35–45 Seater" },
];

const DEFAULT_HIGHLIGHTS = [
  "VIP Darshan", "Breakfast Included", "AC Vehicle",
  "Guide Included", "Hotel Included", "Parking Included", "Driver Allowance Included",
];

const emptyForm = (): Partial<PackageData> => ({
  title: "", name: "", route: "", description: "",
  price: undefined, per_person_price: undefined, vehicle_price: undefined, discount_price: undefined,
  vehicle_type: "Sedan", duration: "", distance: "",
  days: 1, nights: 0,
  seating_capacity: undefined, is_ac: true, luggage_capacity: "",
  start_destination: "Ujjain",
  places_to_visit: [], 
  days_itinerary: [{ day: 1, title: "", description: "", notes: "", places: [] }],
  pricing_options: [{ persons: 1, price: 0 }],
  package_highlights: [], included_facilities: [],
  cover_image: "", gallery_images: [],
  is_available: true, is_popular: false, is_featured: false, is_recommended: false,
  meta_title: "", meta_description: "", slug: "",
});

// ─── Shared Primitive Components ─────────────────────────────────────────────

const FieldLabel = ({ icon: Icon, children, optional }: { icon?: any; children: React.ReactNode; optional?: boolean }) => (
  <label className="flex items-center gap-1.5 text-sm font-semibold text-ink mb-1.5">
    {Icon && <Icon size={14} className="text-accent-primary shrink-0" />}
    {children}
    {optional && <span className="text-xs font-normal text-ink-muted ml-1">(optional)</span>}
  </label>
);

const Field = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      "w-full h-11 rounded-xl border border-border bg-surface/60 px-3.5 text-sm text-ink placeholder:text-ink-muted/60",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary transition-all",
      className
    )}
    {...props}
  />
);

const TextareaField = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "w-full rounded-xl border border-border bg-surface/60 px-3.5 py-3 text-sm text-ink placeholder:text-ink-muted/60 resize-none",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary transition-all",
      className
    )}
    {...props}
  />
);

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer group select-none">
    <button
      type="button"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
        checked ? "bg-accent-primary shadow-[0_0_12px_rgba(166,58,30,0.4)]" : "bg-border"
      )}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow transition-all duration-300",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
    <span className="text-sm font-medium text-ink group-hover:text-accent-primary transition-colors">{label}</span>
  </label>
);

const SectionCard = ({ title, icon: Icon, children, className, id }: { title: string; icon: any; children: React.ReactNode; className?: string; id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("rounded-2xl border border-border bg-surface/40 backdrop-blur-sm overflow-hidden shadow-sm scroll-mt-24", className)}
  >
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-surface/60">
      <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
        <Icon size={16} className="text-accent-primary" />
      </div>
      <h3 className="font-semibold text-ink text-sm">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

// ─── Tag Input ───────────────────────────────────────────────────────────────

function TagInput({ tags, onChange, suggestions, placeholder }: { tags: string[]; onChange: (v: string[]) => void; suggestions?: string[]; placeholder?: string }) {
  const [input, setInput] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput("");
    setShowSugg(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const filtered = (suggestions || []).filter(s => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-[44px] rounded-xl border border-border bg-surface/60 px-3 py-2 cursor-text",
          "focus-within:ring-2 focus-within:ring-accent-primary/40 focus-within:border-accent-primary transition-all",
          "flex flex-wrap gap-1.5 items-center"
        )}
      >
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-secondary/20 text-accent-secondary text-xs font-medium">
            {t}
            <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-error transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setShowSugg(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 200)}
          placeholder={tags.length === 0 ? (placeholder || "Type and press Enter…") : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60"
        />
      </div>
      <AnimatePresence>
        {showSugg && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-surface shadow-xl overflow-hidden"
          >
            <div className="p-1 max-h-40 overflow-y-auto">
              {filtered.map(s => (
                <button key={s} type="button" onMouseDown={() => addTag(s)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink hover:bg-accent-primary/10 hover:text-accent-primary transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Gallery Input ────────────────────────────────────────────────────────────

function GalleryInput({ images, onChange }: { images: string[]; onChange: (v: string[]) => void }) {
  const [urlInput, setUrlInput] = useState("");

  const add = () => {
    const val = urlInput.trim();
    if (val && !images.includes(val)) { onChange([...images, val]); setUrlInput(""); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Field
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Paste image URL and press Enter…"
        />
        <button type="button" onClick={add}
          className="px-4 rounded-xl bg-accent-primary/10 text-accent-primary text-sm font-medium hover:bg-accent-primary/20 transition-colors whitespace-nowrap border border-accent-primary/20">
          Add
        </button>
      </div>
      <ImageUploadArea
        value={images}
        onChange={(v) => onChange(v as string[])}
        folder="packages"
        multiple
      />
    </div>
  );
}

// ─── Destination Checkbox Card ────────────────────────────────────────────────

function DestinationCard({ name, selected, onClick }: { name: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5 text-center gap-2",
        selected
          ? "border-accent-primary bg-accent-primary/10 shadow-md shadow-accent-primary/20"
          : "border-border bg-surface/40 hover:border-accent-primary/40"
      )}
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", selected ? "bg-accent-primary text-surface" : "bg-surface border border-border text-ink-muted")}>
        <MapPinned size={18} />
      </div>
      <span className={cn("text-xs font-semibold leading-tight", selected ? "text-accent-primary" : "text-ink")}>{name}</span>
    </button>
  );
}

// ─── Day Itinerary Builder ───────────────────────────────────────────────────

function DayItineraryBuilder({ daysItinerary, onChange }: { daysItinerary: DayItinerary[]; onChange: (v: DayItinerary[]) => void }) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const updateDay = (dayIndex: number, field: keyof DayItinerary, value: string | string[] | number) => {
    const newItin = [...daysItinerary];
    newItin[dayIndex] = { ...newItin[dayIndex], [field]: value };
    onChange(newItin);
  };

  const togglePlace = (dayIndex: number, place: string) => {
    const places = daysItinerary[dayIndex].places || [];
    const newPlaces = places.includes(place) ? places.filter(p => p !== place) : [...places, place];
    updateDay(dayIndex, 'places', newPlaces);
  };

  return (
    <div className="space-y-4 mt-4">
      {daysItinerary.map((day, index) => {
        const isExpanded = expandedDay === day.day;
        return (
          <div key={day.day} className="rounded-xl border border-border overflow-hidden bg-surface/30 transition-all">
            <button
              type="button"
              onClick={() => setExpandedDay(isExpanded ? null : day.day)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-4 transition-colors",
                isExpanded ? "bg-accent-primary/5 border-b border-border" : "hover:bg-surface"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm", isExpanded ? "bg-accent-primary text-surface shadow-md" : "bg-surface border border-border text-ink-muted")}>
                  {day.day}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-ink text-sm">Day {day.day} {day.title ? `— ${day.title}` : ""}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{day.places?.length || 0} destinations selected</div>
                </div>
              </div>
              {isExpanded ? <ChevronUp size={18} className="text-accent-primary" /> : <ChevronDown size={18} className="text-ink-muted" />}
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel icon={Tag} optional>Day Title</FieldLabel>
                        <Field value={day.title} onChange={e => updateDay(index, 'title', e.target.value)} placeholder="e.g. Explore Omkareshwar" />
                      </div>
                      <div>
                        <FieldLabel icon={Info} optional>Special Notes</FieldLabel>
                        <Field value={day.notes} onChange={e => updateDay(index, 'notes', e.target.value)} placeholder="e.g. Carry ID proof, VIP Darshan at 2 PM" />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel icon={Info} optional>Description</FieldLabel>
                        <TextareaField rows={3} value={day.description} onChange={e => updateDay(index, 'description', e.target.value)} placeholder="Morning departure... Lunch... Return..." />
                      </div>
                    </div>
                    
                    <div>
                      <FieldLabel icon={MapPinned}>Destinations for Day {day.day}</FieldLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                        {PLACES_OPTIONS.map(place => (
                          <DestinationCard
                            key={place}
                            name={place}
                            selected={(day.places || []).includes(place)}
                            onClick={() => togglePlace(index, place)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Pricing Builder ─────────────────────────────────────────────────────────

function PricingBuilder({ pricing, onChange }: { pricing: PricingOption[]; onChange: (v: PricingOption[]) => void }) {
  const updateRow = (index: number, field: keyof PricingOption, value: number | undefined) => {
    const newPricing = [...pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    onChange(newPricing);
  };

  const removeRow = (index: number) => {
    if (pricing.length <= 1) return;
    onChange(pricing.filter((_, i) => i !== index));
  };

  const addRow = () => {
    const lastPersons = pricing.length > 0 ? pricing[pricing.length - 1].persons : 0;
    onChange([...pricing, { persons: lastPersons + 1, price: 0 }]);
  };

  const prices = pricing.map(p => p.price).filter(p => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="p-4 rounded-xl border border-border bg-surface/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center"><TrendingUp size={18} /></div>
          <div><div className="text-xs text-ink-muted">Lowest Price</div><div className="font-bold text-ink">₹{minPrice.toLocaleString()}</div></div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center"><Flame size={18} /></div>
          <div><div className="text-xs text-ink-muted">Highest Price</div><div className="font-bold text-ink">₹{maxPrice.toLocaleString()}</div></div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center"><DollarSign size={18} /></div>
          <div><div className="text-xs text-ink-muted">Average Price</div><div className="font-bold text-ink">₹{avgPrice.toLocaleString()}</div></div>
        </div>
      </div>

      <div className="space-y-3">
        {pricing.map((row, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-end sm:items-center gap-3 p-4 rounded-xl border border-border bg-surface/30">
            <div className="flex-1 w-full">
              <FieldLabel icon={Users}>No. of Persons</FieldLabel>
              <Field type="number" min={1} value={row.persons || ""} onChange={e => updateRow(index, 'persons', Number(e.target.value))} />
            </div>
            <div className="flex-1 w-full">
              <FieldLabel icon={DollarSign}>Total Price (₹)</FieldLabel>
              <Field type="number" min={0} value={row.price || ""} onChange={e => updateRow(index, 'price', Number(e.target.value))} />
            </div>
            <div className="flex-1 w-full">
              <FieldLabel icon={Star} optional>Discount Price (₹)</FieldLabel>
              <Field type="number" min={0} value={row.discount_price || ""} onChange={e => updateRow(index, 'discount_price', e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div className="pb-1">
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={pricing.length <= 1}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-ink-muted hover:text-error hover:bg-error/10 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink-muted transition-all border border-transparent hover:border-error/20"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-accent-primary/40 text-accent-primary hover:bg-accent-primary/5 transition-all text-sm font-semibold"
      >
        <Plus size={16} /> Add Pricing Row
      </button>
    </div>
  );
}

// ─── Journey Summary Card ────────────────────────────────────────────────────

function JourneySummaryCard({ form }: { form: Partial<PackageData> }) {
  const allPlaces = (form.days_itinerary || []).flatMap(d => d.places || []);
  const uniquePlaces = [...new Set(allPlaces)];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface to-accent-primary/5 border border-border p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-ink text-lg">{form.title || "Untitled Package"}</h3>
        <p className="text-sm text-ink-muted">{form.route || "No route defined"}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 bg-surface border border-border rounded-xl px-6 py-4 shadow-inner">
        <div className="text-center">
          <div className="text-2xl font-black text-accent-primary">{form.days || 1}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Days</div>
        </div>
        <div className="w-px h-8 bg-border"></div>
        <div className="text-center">
          <div className="text-2xl font-black text-accent-primary">{form.nights || 0}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Nights</div>
        </div>
        <div className="w-px h-8 bg-border"></div>
        <div className="text-center">
          <div className="text-2xl font-black text-accent-primary">{uniquePlaces.length}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Destinations</div>
        </div>
      </div>
    </div>
  );
}

// ─── Package Form ─────────────────────────────────────────────────────────────

function PackageForm({
  initial, onSave, onCancel
}: { initial: Partial<PackageData>; onSave: (data: Partial<PackageData>, id?: string) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<PackageData>>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("info");

  // Sync days_itinerary when days change
  useEffect(() => {
    const targetDays = form.days || 1;
    setForm(prev => {
      const currentItinerary = prev.days_itinerary || [];
      if (targetDays > currentItinerary.length) {
        const newItinerary = [...currentItinerary];
        for (let i = currentItinerary.length + 1; i <= targetDays; i++) {
          newItinerary.push({ day: i, title: "", description: "", notes: "", places: [] });
        }
        return { ...prev, days_itinerary: newItinerary };
      } else if (targetDays < currentItinerary.length) {
        return { ...prev, days_itinerary: currentItinerary.slice(0, targetDays) };
      }
      return prev;
    });
  }, [form.days]);

  const set = (key: keyof PackageData, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleFacility = (f: string) => {
    const cur = form.included_facilities || [];
    set("included_facilities", cur.includes(f) ? cur.filter(x => x !== f) : [...cur, f]);
  };

  const autoSlug = () => {
    const slug = (form.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    set("slug", slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { toast.error("Package Title is required."); return; }
    if (!form.pricing_options?.length || form.pricing_options[0].price <= 0) { toast.error("Please add at least one valid pricing row."); return; }
    if (!form.cover_image?.trim()) { toast.error("Please enter a Cover Image URL."); return; }

    setSaving(true);
    // Auto-calculate lowest price as fallback for legacy `price`
    const prices = form.pricing_options.map(p => p.price).filter(p => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    
    // Update places_to_visit flat array from days_itinerary for legacy
    const allPlaces = [...new Set((form.days_itinerary || []).flatMap(d => d.places || []))];

    await onSave({ ...form, price: minPrice, places_to_visit: allPlaces }, form.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isEdit = !!initial.id;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  const SECTIONS = [
    { id: "info", label: "Info", icon: Package },
    { id: "journey", label: "Journey", icon: MapPin },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "seo", label: "SEO", icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pb-24 relative"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-ink-muted text-sm mb-1">
            <button type="button" onClick={onCancel} className="hover:text-accent-primary transition-colors">Packages</button>
            <ChevronDown size={14} className="-rotate-90" />
            <span className="text-ink">{isEdit ? "Edit Package" : "New Package"}</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">
            {isEdit ? "Edit Package" : "Create New Package"}
          </h1>
        </div>
        <button type="button" onClick={onCancel}
          className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-ink-muted hover:text-error hover:border-error hover:bg-error/10 transition-all">
          <X size={18} />
        </button>
      </div>

      {/* Progress Navigation */}
      <div className="sticky top-[72px] z-20 bg-surface/80 backdrop-blur-md border border-border rounded-2xl p-1 mb-8 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollTo(`section-${sec.id}`)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeSection === `section-${sec.id}`
                  ? "bg-accent-primary/10 text-accent-primary shadow-sm"
                  : "text-ink-muted hover:bg-surface hover:text-ink"
              )}
            >
              <sec.icon size={16} />
              {sec.label}
              {activeSection === `section-${sec.id}` && <Check size={14} className="ml-1 opacity-70" />}
            </button>
          ))}
        </div>
      </div>

      <form id="package-form" onSubmit={handleSubmit} className="space-y-8">
        
        {/* Journey Summary Preview */}
        <JourneySummaryCard form={form} />

        {/* 1. Package Information */}
        <SectionCard id="section-info" title="Package Information" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FieldLabel icon={Hash}>Package Name</FieldLabel>
              <Field value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="e.g. ujjain-omkareshwar-day-trip" />
              <p className="text-xs text-ink-muted mt-1">Short internal identifier</p>
            </div>
            <div>
              <FieldLabel icon={Tag}>Package Title <span className="text-error">*</span></FieldLabel>
              <Field value={form.title || ""} onChange={e => set("title", e.target.value)} placeholder="e.g. Ujjain to Omkareshwar — One Day Yatra" required />
            </div>
            <div>
              <FieldLabel icon={MapPin}>Route Name</FieldLabel>
              <Field value={form.route || ""} onChange={e => set("route", e.target.value)} placeholder="e.g. Ujjain → Omkareshwar → Ujjain" />
            </div>
            <div>
              <FieldLabel icon={MapPin}>Start Destination</FieldLabel>
              <select
                value={form.start_destination || "Ujjain"}
                onChange={e => set("start_destination", e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-surface/60 px-3.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary transition-all"
              >
                <option value="Ujjain">Ujjain</option>
                <option value="Indore">Indore</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Omkareshwar">Omkareshwar</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <FieldLabel icon={Info}>Package Description</FieldLabel>
              <TextareaField
                rows={4}
                value={form.description || ""}
                onChange={e => set("description", e.target.value)}
                placeholder="Describe the package — itinerary overview, inclusions, temple info, special notes…"
              />
            </div>
          </div>
        </SectionCard>

        {/* 2. Journey Details (Dynamic Itinerary) */}
        <SectionCard id="section-journey" title="Journey Details & Itinerary" icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 bg-surface/30 p-5 rounded-xl border border-border">
            <div>
              <FieldLabel icon={Calendar}>Number of Days</FieldLabel>
              <Field type="number" min={1} value={form.days ?? 1} onChange={e => set("days", e.target.value ? Number(e.target.value) : 1)} placeholder="1" />
            </div>
            <div>
              <FieldLabel icon={Moon}>Number of Nights</FieldLabel>
              <Field type="number" min={0} value={form.nights ?? 0} onChange={e => set("nights", e.target.value ? Number(e.target.value) : 0)} placeholder="0" />
            </div>
            <div>
              <FieldLabel icon={MapPin}>Total Distance</FieldLabel>
              <Field value={form.distance || ""} onChange={e => set("distance", e.target.value)} placeholder="e.g. ~140 km" />
            </div>
            <div>
              <FieldLabel icon={Clock}>Estimated Duration</FieldLabel>
              <Field value={form.duration || ""} onChange={e => set("duration", e.target.value)} placeholder="e.g. 4–5 Hours" />
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            <h4 className="text-lg font-bold text-ink mb-1 flex items-center gap-2"><Calendar size={18} className="text-accent-primary" /> Day-wise Itinerary</h4>
            <p className="text-sm text-ink-muted mb-4">Plan out the locations and activities for each day.</p>
            <DayItineraryBuilder 
              daysItinerary={form.days_itinerary || []}
              onChange={v => set("days_itinerary", v)}
            />
          </div>
        </SectionCard>

        {/* 3. Flexible Pricing */}
        <SectionCard id="section-pricing" title="Flexible Pricing" icon={DollarSign}>
          <PricingBuilder 
            pricing={form.pricing_options || []}
            onChange={v => set("pricing_options", v)}
          />
        </SectionCard>

        {/* 4. Vehicle & Facilities */}
        <SectionCard id="section-vehicle" title="Vehicle Details & Facilities" icon={Car}>
          <div className="space-y-8">
            {/* Vehicle Selection */}
            <div>
              <FieldLabel icon={Car}>Vehicle Type</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                {VEHICLE_TYPES.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => set("vehicle_type", v.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5",
                      form.vehicle_type === v.id
                        ? "border-accent-primary bg-accent-primary/10 shadow-md shadow-accent-primary/20"
                        : "border-border bg-surface/40 hover:border-accent-primary/40"
                    )}
                  >
                    <v.icon size={24} strokeWidth={1.5} className={cn(form.vehicle_type === v.id ? "text-accent-primary" : "text-ink-muted")} />
                    <span className={cn("text-xs font-semibold", form.vehicle_type === v.id ? "text-accent-primary" : "text-ink")}>{v.label}</span>
                    <span className="text-[10px] text-ink-muted">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <FieldLabel icon={Users}>Seating Capacity</FieldLabel>
                <Field type="number" min={1} value={form.seating_capacity ?? ""} onChange={e => set("seating_capacity", e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g. 6" />
              </div>
              <div>
                <FieldLabel icon={Luggage}>Luggage Capacity</FieldLabel>
                <Field value={form.luggage_capacity || ""} onChange={e => set("luggage_capacity", e.target.value)} placeholder="e.g. 2 large bags" />
              </div>
              <div className="flex flex-col justify-end pb-0.5">
                <Toggle checked={!!form.is_ac} onChange={v => set("is_ac", v)} label="Air Conditioned (AC)" />
              </div>
            </div>

            {/* Included Facilities */}
            <div className="border-t border-border pt-8">
              <FieldLabel icon={BadgeCheck}>Included Facilities</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {FACILITIES.map(f => {
                  const checked = (form.included_facilities || []).includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFacility(f.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all group",
                        checked
                          ? "bg-accent-primary/10 border-accent-primary text-accent-primary shadow-[0_0_0_1px_rgb(166,58,30,0.3)]"
                          : "border-border text-ink-muted hover:border-accent-primary/40 hover:text-ink"
                      )}
                    >
                      <f.icon size={18} className={cn("transition-colors", checked ? "text-accent-primary" : "text-ink-muted group-hover:text-accent-primary")} />
                      <span>{f.id}</span>
                      {checked && <Check size={13} className="ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 5. Images */}
        <SectionCard id="section-images" title="Images" icon={ImageIcon}>
          <div className="space-y-6">
            <div>
              <FieldLabel icon={ImageIcon}>Cover Image <span className="text-error">*</span></FieldLabel>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Field
                    value={form.cover_image || ""}
                    onChange={e => set("cover_image", e.target.value)}
                    placeholder="https://… (image URL)"
                  />
                </div>
                <ImageUploadArea
                  value={form.cover_image || ""}
                  onChange={v => set("cover_image", v)}
                  folder="packages"
                />
              </div>
            </div>
            <div>
              <FieldLabel icon={LayoutGrid} optional>Gallery Images</FieldLabel>
              <GalleryInput
                images={form.gallery_images || []}
                onChange={v => set("gallery_images", v)}
              />
            </div>
          </div>
        </SectionCard>

        {/* 6. SEO & Status */}
        <SectionCard id="section-seo" title="SEO & Status" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted border-b border-border pb-2">Package Visibility & Tags</p>
              <Toggle checked={!!form.is_available} onChange={v => set("is_available", v)} label="Available for Booking" />
              <Toggle checked={!!form.is_popular} onChange={v => set("is_popular", v)} label="Mark as Popular" />
              <Toggle checked={!!form.is_featured} onChange={v => set("is_featured", v)} label="Featured Package" />
              <Toggle checked={!!form.is_recommended} onChange={v => set("is_recommended", v)} label="Recommended" />
              
              <div className="pt-4">
                <FieldLabel icon={Tag} optional>Package Highlights</FieldLabel>
                <TagInput
                  tags={form.package_highlights || []}
                  onChange={v => set("package_highlights", v)}
                  suggestions={DEFAULT_HIGHLIGHTS}
                  placeholder="e.g. VIP Darshan, AC Vehicle…"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted border-b border-border pb-2">Search Engine Optimization</p>
              <div>
                <FieldLabel icon={Globe} optional>Meta Title</FieldLabel>
                <Field value={form.meta_title || ""} onChange={e => set("meta_title", e.target.value)} placeholder="Package title for search engines" />
              </div>
              <div>
                <FieldLabel icon={Hash} optional>Slug</FieldLabel>
                <div className="flex gap-2">
                  <Field value={form.slug || ""} onChange={e => set("slug", e.target.value)} placeholder="ujjain-omkareshwar-trip" />
                  <button type="button" onClick={autoSlug}
                    className="px-3 rounded-xl border border-border text-ink-muted hover:text-accent-primary hover:border-accent-primary transition-all text-xs whitespace-nowrap">
                    Auto
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel icon={Info} optional>Meta Description</FieldLabel>
                <TextareaField rows={3} value={form.meta_description || ""} onChange={e => set("meta_description", e.target.value)} placeholder="Brief description for search results…" />
              </div>
            </div>
          </div>
        </SectionCard>
      </form>

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/80 backdrop-blur-lg border-t border-border p-4 z-50 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-border text-ink-muted hover:text-ink hover:bg-surface transition-all text-sm font-medium">
            Cancel
          </button>
          <span className="text-sm text-ink-muted hidden sm:inline-flex items-center gap-1.5">
            <Info size={14} /> Unsaved changes
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || saved}
          className={cn(
            "flex items-center gap-2.5 px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
            saved
              ? "bg-success text-white shadow-lg shadow-success/30"
              : "bg-gradient-to-r from-accent-primary to-accent-primary/80 text-surface shadow-lg shadow-accent-primary/30 hover:shadow-accent-primary/50 hover:-translate-y-0.5 active:translate-y-0",
            (saving || saved) && "pointer-events-none"
          )}
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : saved ? (
            <><Check size={16} /> Saved!</>
          ) : (
            <><Save size={16} /> {isEdit ? "Update Package" : "Create Package"}</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface/40 backdrop-blur-sm">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
        <Icon size={18} className="text-surface" />
      </div>
      <div>
        <div className="text-2xl font-bold text-ink">{value}</div>
        <div className="text-xs text-ink-muted">{label}</div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-3xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group">
        <Mountain size={48} className="text-accent-primary group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-ink mb-2">No Packages Yet</h3>
      <p className="text-ink-muted text-sm max-w-sm mb-8 leading-relaxed">
        Create your first pilgrimage package with complete itinerary, pricing, and vehicle details.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-primary/80 text-surface text-sm font-semibold shadow-lg shadow-accent-primary/30 hover:shadow-accent-primary/50 hover:-translate-y-0.5 transition-all"
      >
        <Plus size={16} /> Create Your First Package
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editPkg, setEditPkg] = useState<Partial<PackageData>>(emptyForm());
  const [search, setSearch] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("packages").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load packages");
    else setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleSave = async (data: Partial<PackageData>, id?: string) => {
    const payload = { ...data };
    delete (payload as Record<string, unknown>).id;

    if (id) {
      const { error } = await supabase.from("packages").update(payload).eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Package updated!");
    } else {
      const { error } = await supabase.from("packages").insert([payload]);
      if (error) { toast.error(error.message); return; }
      toast.success("Package created!");
    }
    fetchPackages();
    setTimeout(() => setView("list"), 1200);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Package deleted"); fetchPackages(); }
  };

  const openCreate = () => { setEditPkg(emptyForm()); setView("form"); };
  const openEdit = (pkg: PackageData) => { setEditPkg({ ...emptyForm(), ...pkg }); setView("form"); };

  // ─── Filtered & Sorted list ────────────────────────────────────────────────

  const filtered = packages.filter(pkg => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      pkg.title?.toLowerCase().includes(q) ||
      pkg.route?.toLowerCase().includes(q) ||
      pkg.vehicle_type?.toLowerCase().includes(q) ||
      (pkg.places_to_visit || []).some(p => p.toLowerCase().includes(q));
    const matchVehicle = !filterVehicle || pkg.vehicle_type === filterVehicle;
    const matchStatus = !filterStatus ||
      (filterStatus === "available" && pkg.is_available) ||
      (filterStatus === "unavailable" && !pkg.is_available) ||
      (filterStatus === "popular" && pkg.is_popular) ||
      (filterStatus === "featured" && pkg.is_featured);
    return matchSearch && matchVehicle && matchStatus;
  }).sort((a, b) => {
    if (sortBy === "price_high") return (b.price || 0) - (a.price || 0);
    if (sortBy === "price_low") return (a.price || 0) - (b.price || 0);
    if (sortBy === "oldest") return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const totalAvailable = packages.filter(p => p.is_available).length;
  const totalPopular = packages.filter(p => p.is_popular).length;
  const totalFeatured = packages.filter(p => p.is_featured).length;

  if (view === "form") {
    return (
      <PackageForm
        initial={editPkg}
        onSave={handleSave}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-1">Package Management</h1>
          <p className="text-sm text-ink-muted">Manage your pilgrimage travel packages</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-primary to-accent-primary/80 text-surface text-sm font-semibold shadow-lg shadow-accent-primary/30 hover:shadow-accent-primary/50 hover:-translate-y-0.5 transition-all w-fit"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* Stats */}
      {packages.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Packages" value={packages.length} icon={Package} color="bg-accent-primary" />
          <StatCard label="Available" value={totalAvailable} icon={Eye} color="bg-success" />
          <StatCard label="Popular" value={totalPopular} icon={Flame} color="bg-accent-secondary" />
          <StatCard label="Featured" value={totalFeatured} icon={Award} color="bg-error" />
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search packages, destinations, vehicles…"
            className="w-full h-11 rounded-xl border border-border bg-surface/60 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary transition-all"
          />
        </div>
        <select
          value={filterVehicle}
          onChange={e => setFilterVehicle(e.target.value)}
          className="h-11 rounded-xl border border-border bg-surface/60 px-3.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
        >
          <option value="">All Vehicles</option>
          {VEHICLE_TYPES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-11 rounded-xl border border-border bg-surface/60 px-3.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="popular">Popular</option>
          <option value="featured">Featured</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="h-11 rounded-xl border border-border bg-surface/60 px-3.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Highest Price</option>
          <option value="price_low">Lowest Price</option>
        </select>
        <button onClick={fetchPackages}
          className="h-11 px-4 rounded-xl border border-border text-ink-muted hover:text-accent-primary hover:border-accent-primary transition-all flex items-center gap-2 text-sm whitespace-nowrap">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="px-4 py-3.5 text-left font-semibold text-ink text-xs uppercase tracking-wider">Package</th>
                <th className="px-4 py-3.5 text-left font-semibold text-ink text-xs uppercase tracking-wider hidden md:table-cell">Journey</th>
                <th className="px-4 py-3.5 text-left font-semibold text-ink text-xs uppercase tracking-wider hidden lg:table-cell">Vehicle</th>
                <th className="px-4 py-3.5 text-left font-semibold text-ink text-xs uppercase tracking-wider">Starting Price</th>
                <th className="px-4 py-3.5 text-left font-semibold text-ink text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-4 py-3.5 text-right font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-bg/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-ink-muted">
                      <Loader2 size={24} className="animate-spin text-accent-primary" />
                      <span className="text-sm">Loading packages…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState onAdd={openCreate} />
                  </td>
                </tr>
              ) : (
                filtered.map((pkg, i) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-surface/50 transition-colors group"
                  >
                    {/* Package */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden border border-border bg-surface flex-shrink-0">
                          {pkg.cover_image || pkg.images?.[0] ? (
                            <img src={pkg.cover_image || pkg.images?.[0]} alt={pkg.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent-primary/10">
                              <Mountain size={16} className="text-accent-primary/50" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-ink leading-tight truncate max-w-[180px]">{pkg.title}</div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {pkg.is_popular && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-accent-secondary/20 text-accent-secondary text-[10px] font-medium">
                                <Flame size={8} /> Popular
                              </span>
                            )}
                            {pkg.is_featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-error/20 text-error text-[10px] font-medium">
                                <Award size={8} /> Featured
                              </span>
                            )}
                            {pkg.is_recommended && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary text-[10px] font-medium">
                                <BadgeCheck size={8} /> Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Journey */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-xs text-ink-muted space-y-0.5">
                        {pkg.route && <div className="flex items-center gap-1"><MapPin size={11} className="text-accent-primary" />{pkg.route}</div>}
                        {(pkg.days || pkg.nights) && (
                          <div className="flex items-center gap-1">
                            <Calendar size={11} className="text-accent-primary" />
                            {pkg.days ? `${pkg.days}D` : ""}{pkg.nights ? `/${pkg.nights}N` : ""}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Vehicle */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-ink">
                        <span>
                          {(() => {
                            const Icon = VEHICLE_TYPES.find(v => v.id === pkg.vehicle_type)?.icon || Car;
                            return <Icon size={14} className="text-ink-muted" />;
                          })()}
                        </span>
                        <span>{pkg.vehicle_type || "—"}</span>
                      </div>
                      {pkg.is_ac !== undefined && (
                        <div className="text-[10px] text-ink-muted mt-0.5">{pkg.is_ac ? "AC" : "Non-AC"}</div>
                      )}
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-accent-primary">
                        ₹{(pkg.price || 0).toLocaleString()}
                      </div>
                      {pkg.discount_price && (
                        <div className="text-xs text-ink-muted line-through">₹{pkg.discount_price.toLocaleString()}</div>
                      )}
                      <div className="text-[10px] text-ink-muted">Starting from</div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {pkg.is_available ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/15 text-success text-xs font-medium">
                          <CircleCheck size={10} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-muted/15 text-ink-muted text-xs font-medium">
                          <EyeOff size={10} /> Hidden
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(pkg)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-error hover:bg-error/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-surface/40 text-xs text-ink-muted">
            Showing {filtered.length} of {packages.length} packages
            {(search || filterVehicle || filterStatus) && (
              <button onClick={() => { setSearch(""); setFilterVehicle(""); setFilterStatus(""); }}
                className="ml-3 text-accent-primary hover:underline">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
