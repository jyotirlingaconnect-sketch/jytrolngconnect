"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email?: string;
  travel_date?: string;
  pickup_location?: string;
  drop_location?: string;
  vehicle_preference?: string;
  no_of_passengers?: number;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load bookings");
    else setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Booking status updated to ${status}`);
      fetchBookings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking deleted");
      fetchBookings();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Bookings & Enquiries</h1>
          <p className="text-ink-muted">Manage customer bookings and contact requests</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface border-b border-border text-ink font-medium">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Journey</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-bg">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-muted">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-muted">No bookings found</td></tr>
              ) : (
                bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">{bk.full_name}</div>
                      <div className="text-ink-muted">{bk.phone}</div>
                      {bk.email && <div className="text-ink-muted text-xs">{bk.email}</div>}
                      <div className="text-[10px] text-ink-muted mt-1">{new Date(bk.created_at).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {bk.travel_date ? (
                        <>
                          <div className="text-ink font-medium">{new Date(bk.travel_date).toLocaleDateString()}</div>
                          <div className="text-ink-muted text-xs">{bk.pickup_location} → {bk.drop_location}</div>
                          <div className="text-ink-muted text-xs">{bk.vehicle_preference} • {bk.no_of_passengers} pax</div>
                        </>
                      ) : (
                        <span className="text-ink-muted italic">General Enquiry</span>
                      )}
                      {bk.message && (
                        <div className="mt-2 p-2 bg-surface rounded text-xs text-ink line-clamp-2 max-w-[250px]" title={bk.message}>
                          {bk.message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={bk.status}
                        onChange={(e) => updateStatus(bk.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full outline-none border-none cursor-pointer ${
                          bk.status === 'pending' ? 'bg-orange-500/10 text-orange-600' :
                          bk.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600' :
                          bk.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                          'bg-red-500/10 text-red-600'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(bk.id)} className="text-error hover:text-error hover:bg-error/10">
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
