"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Phone, CheckCircle, XCircle, MoreVertical, Edit, FileText, User
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "sonner";

interface RecentBookingsTableProps {
  bookings: any[];
  onUpdate: () => void;
}

export function RecentBookingsTable({ bookings, onUpdate }: RecentBookingsTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      toast.success(`Booking status updated to ${newStatus}`);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden">
      <CardHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-display font-bold text-ink">Recent Bookings</CardTitle>
        <Link href="/admin/bookings" className="text-sm font-medium text-accent-primary hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-bg/50 border-b border-border/50 text-ink-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Travel Date</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-muted">
                    No recent bookings found.
                  </td>
                </tr>
              ) : (
                bookings.slice(0, 10).map((bk) => (
                  <tr key={bk.id} className="hover:bg-bg/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(bk.full_name)}
                        </div>
                        <div>
                          <div className="font-medium text-ink">{bk.full_name}</div>
                          <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                            <Phone size={10} />
                            {bk.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {bk.travel_date ? (
                        <div className="font-medium text-ink">
                          {format(new Date(bk.travel_date), "MMM dd, yyyy")}
                        </div>
                      ) : (
                        <span className="text-ink-muted">N/A</span>
                      )}
                      <div className="text-xs text-ink-muted mt-0.5">
                        {format(new Date(bk.created_at), "hh:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">
                        {bk.no_of_passengers ? `${bk.no_of_passengers} Passengers` : "General"}
                      </div>
                      <div className="text-xs text-ink-muted mt-0.5 truncate max-w-[150px]">
                        {bk.vehicle_preference || bk.package_id || "Custom Tour"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        bk.status === 'pending' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' :
                        bk.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                        bk.status === 'completed' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                        'bg-red-500/10 text-red-600 border border-red-500/20'
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`tel:${bk.phone}`}
                          className="p-2 bg-surface border border-border/80 text-ink-muted hover:text-green-500 hover:border-green-500/50 rounded-lg transition-colors"
                          title="Call Customer"
                        >
                          <Phone size={16} />
                        </a>
                        
                        {bk.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(bk.id, 'confirmed')}
                            disabled={updatingId === bk.id}
                            className="p-2 bg-surface border border-border/80 text-ink-muted hover:text-blue-500 hover:border-blue-500/50 rounded-lg transition-colors disabled:opacity-50"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        
                        {(bk.status === 'pending' || bk.status === 'confirmed') && (
                          <button 
                            onClick={() => updateStatus(bk.id, 'cancelled')}
                            disabled={updatingId === bk.id}
                            className="p-2 bg-surface border border-border/80 text-ink-muted hover:text-red-500 hover:border-red-500/50 rounded-lg transition-colors disabled:opacity-50"
                            title="Cancel Booking"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        
                        <Link 
                          href={`/admin/bookings/${bk.id}`}
                          className="p-2 bg-surface border border-border/80 text-ink-muted hover:text-accent-primary hover:border-accent-primary/50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FileText size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
