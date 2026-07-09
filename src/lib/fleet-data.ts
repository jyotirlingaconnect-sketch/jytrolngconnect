import { ShieldCheck, Wrench, CheckCircle2, HeadphonesIcon, Users, Map } from "lucide-react";

export const vehicles = [
  {
    id: "ertiga",
    name: "Maruti Suzuki Ertiga",
    capacity: "1–7 Guests",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop",
    desc: "A perfect choice for couples, small families, and small pilgrimage groups. Enjoy comfortable seating, air conditioning, and a smooth ride throughout your spiritual journey.",
    specs: {
      ac: "Fully Air Conditioned",
      luggage: "2 Medium Bags",
      bestFor: "Couples & Small Families"
    },
    features: [
      "Comfortable Seats", "Clean & Sanitized", "GPS Enabled", "Verified Driver"
    ],
    price: "₹3,500",
    popular: false,
  },
  {
    id: "innova",
    name: "Toyota Innova Crysta",
    capacity: "1–6 Guests",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop",
    desc: "Our most premium family vehicle offering spacious interiors, luxurious comfort, excellent suspension, and ample luggage space for long-distance pilgrimages.",
    specs: {
      ac: "Dual AC Vents",
      luggage: "4 Large Bags",
      bestFor: "Premium Family Travel"
    },
    features: [
      "Luxury Interiors", "Extra Legroom", "Premium Suspension", "Verified Driver"
    ],
    price: "₹5,000",
    popular: true,
  },
  {
    id: "traveller",
    name: "Force Traveller",
    capacity: "8–16 Guests",
    image: "https://images.unsplash.com/photo-1522046428448-6a58bcba9830?q=80&w=2000&auto=format&fit=crop",
    desc: "Designed for larger families and pilgrimage groups. Comfortable seating, generous space, and ideal for group tours to multiple temple destinations.",
    specs: {
      ac: "High Capacity AC",
      luggage: "Ample Roof/Boot Space",
      bestFor: "Large Families & Groups"
    },
    features: [
      "Pushback Seats", "Surround Sound", "Curtains", "Verified Driver"
    ],
    price: "₹8,500",
    popular: false,
  },
  {
    id: "bus",
    name: "Premium Tourist Bus",
    capacity: "20+ Guests",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop",
    desc: "Perfect for large pilgrimage groups, religious organizations, schools, corporate tours, and family gatherings with comfortable seating and professional drivers.",
    specs: {
      ac: "Climate Control AC",
      luggage: "Dedicated Side Storage",
      bestFor: "Mass Tour Groups"
    },
    features: [
      "Recliner Seats", "Onboard Entertainment", "Large Windows", "2 Drivers"
    ],
    price: "₹15,000",
    popular: false,
  }
];

export const compareData = [
  { vehicle: "Ertiga", guests: "1-7", comfort: "Standard", luggage: "Low", bestFor: "Small Families" },
  { vehicle: "Innova Crysta", guests: "1-6", comfort: "Premium", luggage: "High", bestFor: "Luxury Family Travel" },
  { vehicle: "Traveller", guests: "8-16", comfort: "High", luggage: "High", bestFor: "Group Tours" },
  { vehicle: "Tourist Bus", guests: "20+", comfort: "High", luggage: "Maximum", bestFor: "Large Organizations" },
];

export const whyChooseUs = [
  { title: "Verified Drivers", desc: "Expert, background-checked professionals.", icon: ShieldCheck },
  { title: "Regular Maintenance", desc: "Vehicles serviced before every long trip.", icon: Wrench },
  { title: "Clean & Sanitized", desc: "Spotless interiors for a pure journey.", icon: CheckCircle2 },
  { title: "24×7 Roadside Support", desc: "We are always here if you need us.", icon: HeadphonesIcon },
  { title: "Comfortable Travel", desc: "Pushback seats and ample legroom.", icon: Users },
  { title: "GPS Enabled", desc: "Real-time tracking for ultimate safety.", icon: Map },
];
