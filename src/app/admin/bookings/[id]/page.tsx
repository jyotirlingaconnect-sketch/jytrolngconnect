"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Car, Users,
  MessageSquare, Clock, CheckCircle, XCircle, AlertCircle,
  MailCheck, MailX, Trash2, FileText, TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { updateBookingStatusAction } from "@/app/actions/booking";
import { toast } from "sonner";
import Link from "next/link";

interface Booking {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email?: string;
  user_email?: string;
  travel_date?: string;
  pickup_location?: string;
  drop_location?: string;
  vehicle_preference?: string;
  no_of_passengers?: number;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  admin_notes?: string;
  booking_reference?: string;
  email_sent?: boolean;
  admin_notification_sent?: boolean;
  confirmation_sent_at?: string;
  admin_notification_sent_at?: string;
  package_id?: string;
}

interface EmailLog {
  id: string;
  email_type: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed";
  resend_message_id?: string;
  error_message?: string;
  created_at: string;
}

const statusConfig = {
  pending:   { label: "Pending",   color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "text-blue-500",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   icon: CheckCircle },
  completed: { label: "Completed", color: "text-green-500",  bg: "bg-green-500/10",  border: "border-green-500/20",  icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-500",    bg: "bg-red-500/10",    border: "border-red-500/20",    icon: XCircle },
};

function DetailCard({ icon: Icon, label, value, color = "text-accent-primary" }: {
  icon: any; label: string; value?: string | number | null; color?: string;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-bg/60 border border-border/50 hover:bg-bg transition-colors">
      <div className={`w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-ink break-words">{value}</p>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Booking not found");
      router.push("/admin/bookings");
      return;
    }
    setBooking(data);
    setAdminNotes(data.admin_notes || "");

    // Fetch email logs — swallow errors if table not migrated yet
    const { data: logs } = await supabase
      .from("email_logs")
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: false });

    setEmailLogs(logs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return;
    setUpdatingStatus(true);
    const result = await updateBookingStatusAction(booking.id, newStatus, booking);
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
      fetchBooking();
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setUpdatingStatus(false);
  };

  const handleSaveNotes = async () => {
    if (!booking) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from("bookings")
      .update({ admin_notes: adminNotes })
      .eq("id", booking.id);
    if (error) toast.error("Failed to save notes");
    else toast.success("Notes saved");
    setSavingNotes(false);
  };

  const handleDelete = async () => {
    if (!booking) return;
    if (!confirm("Permanently delete this booking? This cannot be undone.")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", booking.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking deleted");
      router.push("/admin/bookings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-ink-muted font-medium animate-pulse">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const status = statusConfig[booking.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;
  const contactEmail = booking.email || booking.user_email;

  const allStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookings"
            className="w-10 h-10 rounded-xl bg-surface border border-border/60 flex items-center justify-center text-ink-muted hover:text-accent-primary hover:border-accent-primary/50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-0.5">
              Booking #{booking.booking_reference || booking.id.substring(0, 8).toUpperCase()}
            </p>
            <h1 className="text-2xl font-display font-bold text-ink">{booking.full_name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
            <StatusIcon size={12} />
            {status.label}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="rounded-xl text-red-500 border border-red-500/30 hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 size={14} className="mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Column (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer Details */}
          <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50">
              <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                <User size={16} className="text-accent-primary" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailCard icon={User}     label="Full Name"   value={booking.full_name} />
              <DetailCard icon={Phone}    label="Phone"       value={booking.phone} />
              <DetailCard icon={Mail}     label="Email"       value={contactEmail} />
              <DetailCard icon={Clock}    label="Booked At"   value={format(new Date(booking.created_at), "dd MMM yyyy, hh:mm a")} />
            </CardContent>
          </Card>

          {/* Journey Details */}
          <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50">
              <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                <MapPin size={16} className="text-accent-primary" />
                Journey Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailCard icon={Calendar} label="Travel Date"       value={booking.travel_date ? format(new Date(booking.travel_date), "dd MMM yyyy") : undefined} />
              <DetailCard icon={Users}    label="Passengers"        value={booking.no_of_passengers ? `${booking.no_of_passengers} Passenger${booking.no_of_passengers > 1 ? "s" : ""}` : undefined} />
              <DetailCard icon={MapPin}   label="Pickup Location"   value={booking.pickup_location} />
              <DetailCard icon={MapPin}   label="Drop Location"     value={booking.drop_location} color="text-blue-500" />
              <DetailCard icon={Car}      label="Vehicle Preference" value={booking.vehicle_preference} />
            </CardContent>
          </Card>

          {/* Customer Message */}
          {booking.message && (
            <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-border/50">
                <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                  <MessageSquare size={16} className="text-accent-primary" />
                  Customer Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap bg-bg/60 p-4 rounded-2xl border border-border/50">
                  {booking.message}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50">
              <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                <FileText size={16} className="text-accent-primary" />
                Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes about this booking…"
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-border/50 text-ink text-sm resize-none outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all placeholder:text-ink-muted"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white h-10 px-6"
              >
                {savingNotes ? "Saving…" : "Save Notes"}
              </Button>
            </CardContent>
          </Card>

          {/* Email Logs */}
          {emailLogs.length > 0 && (
            <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-border/50">
                <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                  <MailCheck size={16} className="text-accent-primary" />
                  Email Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {emailLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-3 p-3 rounded-2xl border text-sm ${
                        log.status === "sent"
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      {log.status === "sent" ? (
                        <MailCheck size={16} className="text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <MailX size={16} className="text-red-500 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink capitalize">{log.email_type.replace(/_/g, " ")}</p>
                        <p className="text-ink-muted text-xs truncate">To: {log.recipient}</p>
                        {log.error_message && (
                          <p className="text-red-500 text-xs mt-1">{log.error_message}</p>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted shrink-0 mt-0.5">
                        {format(new Date(log.created_at), "dd MMM, hh:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right Column (1/3) ── */}
        <div className="space-y-6">

          {/* Status Control */}
          <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50">
              <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                <TrendingUp size={16} className="text-accent-primary" />
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {allStatuses.map((s) => {
                const cfg = statusConfig[s];
                const Icon = cfg.icon;
                const isActive = booking.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => !isActive && handleStatusChange(s)}
                    disabled={isActive || updatingStatus}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      isActive
                        ? `${cfg.bg} ${cfg.color} ${cfg.border} cursor-default`
                        : "bg-bg border-border/50 text-ink-muted hover:bg-surface hover:border-accent-primary/30 hover:text-ink"
                    } disabled:opacity-60`}
                  >
                    <Icon size={15} className={isActive ? cfg.color : ""} />
                    {cfg.label}
                    {isActive && <span className="ml-auto text-xs opacity-60">Current</span>}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Email Status */}
          <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50">
              <CardTitle className="text-base font-display font-bold text-ink flex items-center gap-2">
                <Mail size={16} className="text-accent-primary" />
                Email Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                booking.email_sent
                  ? "bg-green-500/10 border-green-500/20 text-green-600"
                  : "bg-orange-500/10 border-orange-500/20 text-orange-600"
              }`}>
                {booking.email_sent ? <MailCheck size={14} /> : <MailX size={14} />}
                {booking.email_sent ? "Confirmation Sent to Customer" : "Confirmation Not Sent"}
              </div>
              {booking.confirmation_sent_at && (
                <p className="text-[10px] text-ink-muted px-1">
                  Sent {format(new Date(booking.confirmation_sent_at), "dd MMM, hh:mm a")}
                </p>
              )}
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                booking.admin_notification_sent
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
                  : "bg-surface border-border/50 text-ink-muted"
              }`}>
                {booking.admin_notification_sent ? <MailCheck size={14} /> : <MailX size={14} />}
                {booking.admin_notification_sent ? "Admin Notified" : "Admin Not Notified"}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50">
              <CardTitle className="text-base font-display font-bold text-ink">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-bg border border-border/50 text-sm font-medium text-ink-muted hover:text-accent-primary hover:border-accent-primary/30 transition-colors"
                >
                  <Mail size={15} />
                  Email Customer
                </a>
              )}
              <a
                href={`tel:${booking.phone}`}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-bg border border-border/50 text-sm font-medium text-ink-muted hover:text-green-500 hover:border-green-500/30 transition-colors"
              >
                <Phone size={15} />
                Call Customer
              </a>
              <a
                href={`https://wa.me/${booking.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-bg border border-border/50 text-sm font-medium text-ink-muted hover:text-green-500 hover:border-green-500/30 transition-colors"
              >
                <MessageSquare size={15} />
                WhatsApp
              </a>
            </CardContent>
          </Card>

        </div>
      </div>
    </motion.div>
  );
}
