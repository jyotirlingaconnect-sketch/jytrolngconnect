"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  LogOut,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Users,
  Car,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  age: number | null;
  image: string | null;
  created_at: string;
}

interface Booking {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  travel_date: string;
  no_of_passengers: number;
  vehicle_preference: string | null;
  pickup_location: string;
  drop_location: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  admin_notes: string | null;
  created_at: string;
}

// ── Helpers ─────────────────────────────────────────────
function getInitials(name?: string | null): string {
  if (!name) return "JC";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    icon: XCircle,
  },
};

// ── Booking Card ─────────────────────────────────────────
function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const st = statusConfig[booking.status] ?? statusConfig.pending;
  const StatusIcon = st.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:shadow-md dark:hover:shadow-white/5 transition-shadow"
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 p-2 rounded-xl ${st.bg}`}>
            <StatusIcon className={`w-5 h-5 ${st.color}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-black dark:text-white">
              {booking.pickup_location}
              <span className="mx-2 text-black/30 dark:text-white/30">→</span>
              {booking.drop_location ?? "Destination"}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                <Calendar className="w-3 h-3" />
                {formatDate(booking.travel_date)}
              </span>
              <span className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                <Users className="w-3 h-3" />
                {booking.no_of_passengers} passenger{booking.no_of_passengers !== 1 ? "s" : ""}
              </span>
              {booking.vehicle_preference && (
                <span className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                  <Car className="w-3 h-3" />
                  {booking.vehicle_preference}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-2 flex-shrink-0">
          <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${st.bg} ${st.color}`}>
            {st.label}
          </span>
          <ChevronRight
            className={`w-4 h-4 text-black/30 dark:text-white/30 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-black/5 dark:border-white/10 space-y-3 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">Booking ID</p>
                  <p className="font-mono text-black dark:text-white text-xs">{booking.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">Booked On</p>
                  <p className="text-black dark:text-white">{formatDate(booking.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">Status</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${st.bg} ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">Pickup</p>
                  <p className="text-black dark:text-white">{booking.pickup_location}</p>
                </div>
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">Drop</p>
                  <p className="text-black dark:text-white">{booking.drop_location ?? "—"}</p>
                </div>
                {booking.vehicle_preference && (
                  <div>
                    <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">Vehicle</p>
                    <p className="text-black dark:text-white">{booking.vehicle_preference}</p>
                  </div>
                )}
              </div>
              {booking.message && (
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-1">Special Requests</p>
                  <p className="text-sm text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2">
                    {booking.message}
                  </p>
                </div>
              )}
              {booking.admin_notes && (
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-1">Admin Notes</p>
                  <p className="text-sm text-black/70 dark:text-white/70 bg-[#D4AF6A]/10 rounded-xl px-3 py-2 border border-[#D4AF6A]/20">
                    {booking.admin_notes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Empty State ──────────────────────────────────────────
function EmptyBookings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#D4AF6A]/10 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF6A]">
            <path d="M3 21h18" /><path d="M12 3v18" />
            <path d="M5 21v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
            <path d="M9 15v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
            <circle cx="12" cy="6" r="2" fill="currentColor" stroke="none" className="text-[#D4AF6A]/40" />
          </svg>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF6A]/20 flex items-center justify-center"
        >
          <span className="text-xs">✦</span>
        </motion.div>
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        No Journeys Yet
      </h3>
      <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mb-6">
        You haven&apos;t booked your spiritual journey yet. Begin your divine pilgrimage today.
      </p>
      <Link
        href="/booking"
        className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF6A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c9973a] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        Book Your Yatra
        <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("all");

  // Editable fields
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAge, setEditAge] = useState("");

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch profile + bookings
  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        supabase.from("users").select("*").eq("email", session.user.email).single(),
        supabase
          .from("bookings")
          .select("*")
          .eq("user_email", session.user.email)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setEditName(profileRes.data.name ?? "");
        setEditPhone(profileRes.data.phone ?? "");
        setEditAge(profileRes.data.age?.toString() ?? "");
      }
      if (bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, fetchData]);

  const handleSave = async () => {
    if (!profile) return;
    const parsedAge = editAge ? parseInt(editAge) : null;
    if (parsedAge !== null && (parsedAge < 18 || parsedAge > 120)) {
      toast.error("Age must be between 18 and 120.");
      return;
    }
    if (!editName.trim() || editName.trim().length < 2) {
      toast.error("Please enter a valid name.");
      return;
    }
    if (editPhone && editPhone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({
        name: editName.trim(),
        phone: editPhone.trim() || null,
        age: parsedAge,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to save changes. Please try again.");
    } else {
      toast.success("Profile updated successfully!");
      setProfile((p) => p ? { ...p, name: editName.trim(), phone: editPhone.trim() || null, age: parsedAge } : p);
      setEditing(false);
    }
    setSaving(false);
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((b) => {
    const d = new Date(b.travel_date);
    d.setHours(0, 0, 0, 0);
    return d >= now && b.status !== "cancelled";
  });

  const pastBookings = bookings.filter((b) => {
    const d = new Date(b.travel_date);
    d.setHours(0, 0, 0, 0);
    return d < now || b.status === "completed" || b.status === "cancelled";
  });

  const displayedBookings =
    activeTab === "upcoming" ? upcomingBookings :
    activeTab === "past" ? pastBookings :
    bookings;

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#D4AF6A] animate-spin" />
          <p className="text-sm text-black/50 dark:text-white/50">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const user = session?.user;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0A0A0A] pt-20 pb-20">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1207] via-[#2a1f0c] to-[#0f0a04] py-16 px-4">
          {/* ambient glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full bg-[#D4AF6A]/10 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-[#D4AF6A]/40 shadow-xl shadow-[#D4AF6A]/20">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Profile"}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#D4AF6A] to-[#c9973a] text-white text-3xl font-bold">
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-green-500 border-2 border-[#1a1207] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-display font-bold text-white mb-1"
            >
              {profile?.name ?? user?.name ?? "Pilgrim"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-white/60 mb-3"
            >
              {user?.email}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF6A]/20 border border-[#D4AF6A]/30 px-3 py-1 text-sm text-[#D4AF6A] font-medium">
                ✦ Verified Traveller
              </span>
              {profile?.created_at && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-white/60">
                  <Clock className="w-3.5 h-3.5" />
                  Joined {new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
              )}
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* ── Personal Info Card ─────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            id="profile"
            className="rounded-3xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#D4AF6A]/10">
                  <User className="w-5 h-5 text-[#D4AF6A]" />
                </div>
                <h2 className="font-semibold text-black dark:text-white text-base">Personal Information</h2>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm text-[#D4AF6A] hover:text-[#c9973a] transition-colors font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-sm bg-[#D4AF6A] text-white rounded-lg px-3 py-1.5 hover:bg-[#c9973a] transition-colors disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-black/40 dark:text-white/40 mb-2 uppercase tracking-wider">
                  <User className="w-3 h-3" /> Full Name
                </label>
                {editing ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/40"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-sm font-medium text-black dark:text-white">
                    {profile?.name ?? user?.name ?? "—"}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-black/40 dark:text-white/40 mb-2 uppercase tracking-wider">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <p className="text-sm font-medium text-black dark:text-white">{user?.email ?? "—"}</p>
                <p className="text-xs text-black/30 dark:text-white/30 mt-0.5">Connected via Google</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-black/40 dark:text-white/40 mb-2 uppercase tracking-wider">
                  <Phone className="w-3 h-3" /> Mobile Number
                </label>
                {editing ? (
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/40"
                    placeholder="+91 98765 43210"
                    type="tel"
                  />
                ) : profile?.phone ? (
                  <p className="text-sm font-medium text-black dark:text-white">{profile.phone}</p>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-[#D4AF6A] hover:text-[#c9973a] transition-colors flex items-center gap-1"
                  >
                    <span className="text-[#D4AF6A]">+</span> Add phone number
                  </button>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-black/40 dark:text-white/40 mb-2 uppercase tracking-wider">
                  <Calendar className="w-3 h-3" /> Age
                </label>
                {editing ? (
                  <input
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/40"
                    placeholder="Your age (18–120)"
                    type="number"
                    min={18}
                    max={120}
                  />
                ) : profile?.age ? (
                  <p className="text-sm font-medium text-black dark:text-white">{profile.age} years</p>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-[#D4AF6A] hover:text-[#c9973a] transition-colors flex items-center gap-1"
                  >
                    <span className="text-[#D4AF6A]">+</span> Add age
                  </button>
                )}
              </div>
            </div>
          </motion.section>

          {/* ── Bookings ─────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            id="bookings"
            className="space-y-5"
          >
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#D4AF6A]/10">
                  <BookOpen className="w-5 h-5 text-[#D4AF6A]" />
                </div>
                <div>
                  <h2 className="font-semibold text-black dark:text-white text-base">My Bookings</h2>
                  <p className="text-xs text-black/40 dark:text-white/40">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <Link
                href="/booking"
                className="text-sm text-[#D4AF6A] hover:text-[#c9973a] transition-colors font-medium flex items-center gap-1"
              >
                + New Booking
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 w-fit">
              {(["all", "upcoming", "past"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm"
                      : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {tab}
                  {tab === "upcoming" && upcomingBookings.length > 0 && (
                    <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF6A] text-[10px] font-bold text-white">
                      {upcomingBookings.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Booking list */}
            {displayedBookings.length === 0 ? (
              <EmptyBookings />
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {displayedBookings.map((booking, i) => (
                    <BookingCard key={booking.id} booking={booking} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>

          {/* ── Logout ─────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center pt-4"
          >
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex items-center gap-3 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 px-8 py-4 text-red-600 dark:text-red-400 font-medium transition-all hover:shadow-md"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              Sign Out of Jyotirling Connect
            </button>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
