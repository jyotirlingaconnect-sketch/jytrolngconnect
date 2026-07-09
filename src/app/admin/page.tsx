"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Image as ImageIcon, BookOpen, MessageSquare } from "lucide-react";

interface Booking {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  travel_date: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    packages: 0,
    gallery: 0,
    bookings: 0,
    pendingBookings: 0,
    testimonials: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: pkgCount },
          { count: galCount },
          { count: bkCount },
          { count: pbkCount },
          { count: testCount },
          { data: recentBk }
        ] = await Promise.all([
          supabase.from("packages").select("*", { count: "exact", head: true }),
          supabase.from("gallery").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5)
        ]);

        setStats({
          packages: pkgCount || 0,
          gallery: galCount || 0,
          bookings: bkCount || 0,
          pendingBookings: pbkCount || 0,
          testimonials: testCount || 0,
        });

        setRecentBookings(recentBk || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-ink-muted text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-error text-sm">Failed to load dashboard stats. Please refresh the page.</p>
      </div>
    );
  }

  const statCards = [
    { title: "Total Packages", value: stats.packages, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Gallery Images", value: stats.gallery, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Total Bookings", value: stats.bookings, icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10", subtext: `${stats.pendingBookings} pending` },
    { title: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-ink mb-2">Dashboard Overview</h1>
        <p className="text-ink-muted">Welcome back! Here is what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-muted">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-ink">{stat.value}</h3>
                  {stat.subtext && <span className="text-xs text-error font-medium">{stat.subtext}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-display font-bold text-ink mb-4">Recent Bookings & Enquiries</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface border-b border-border text-ink font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Travel Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-ink-muted">No recent bookings</td>
                  </tr>
                ) : (
                  recentBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4 text-ink-muted">
                        {new Date(bk.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-ink">{bk.full_name}</td>
                      <td className="px-6 py-4 text-ink-muted">{bk.phone}</td>
                      <td className="px-6 py-4 text-ink-muted">
                        {bk.travel_date ? new Date(bk.travel_date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          bk.status === 'pending' ? 'bg-orange-500/10 text-orange-600' :
                          bk.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600' :
                          bk.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
