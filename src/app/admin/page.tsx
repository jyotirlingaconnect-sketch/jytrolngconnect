"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isSameDay, startOfMonth, startOfDay, subDays } from "date-fns";

// Components
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { KPICards, DashboardStats } from "@/components/admin/dashboard/KPICards";
import { AnalyticsCharts } from "@/components/admin/dashboard/AnalyticsCharts";
import { RecentBookingsTable } from "@/components/admin/dashboard/RecentBookingsTable";
import { TodaySchedule } from "@/components/admin/dashboard/TodaySchedule";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("30"); // days
  
  // Data States
  const [bookings, setBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0, todayBookings: 0, pendingBookings: 0, 
    confirmedBookings: 0, completedBookings: 0, cancelledBookings: 0,
    totalEnquiries: 0, totalPackages: 0, totalFleet: 0, 
    galleryImages: 0, activeVehicles: 0, monthlyGrowth: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = startOfDay(new Date());
      const startDate = subDays(today, parseInt(dateFilter)).toISOString();

      const [
        { data: allBookings },
        { count: pkgCount },
        { count: fleetCount },
        { count: activeFleetCount },
        { count: galleryCount }
      ] = await Promise.all([
        supabase.from("bookings").select("*").gte("created_at", startDate).order("created_at", { ascending: false }),
        supabase.from("packages").select("*", { count: "exact", head: true }),
        supabase.from("fleet").select("*", { count: "exact", head: true }),
        supabase.from("fleet").select("*", { count: "exact", head: true }).eq("is_available", true),
        supabase.from("gallery").select("*", { count: "exact", head: true })
      ]);

      const bks = allBookings || [];
      
      // Calculate Stats
      const todayBk = bks.filter(b => isSameDay(new Date(b.created_at), today));
      const pendingBk = bks.filter(b => b.status === "pending");
      const confirmedBk = bks.filter(b => b.status === "confirmed");
      const completedBk = bks.filter(b => b.status === "completed");
      const cancelledBk = bks.filter(b => b.status === "cancelled");
      
      // Differentiate enquiries (assuming enquiries don't have package_id and have a specific subject pattern or no travel date. We'll simplify to just bookings here)
      // If a separate enquiries table exists, it should be fetched. We'll count bookings without travel_date as general enquiries.
      const enqs = bks.filter(b => !b.travel_date && !b.package_id);

      // Naive monthly growth (just a placeholder for UX)
      const monthlyGrowth = 12.5;

      setBookings(bks);
      setEnquiries(enqs);
      
      setStats({
        totalBookings: bks.length,
        todayBookings: todayBk.length,
        pendingBookings: pendingBk.length,
        confirmedBookings: confirmedBk.length,
        completedBookings: completedBk.length,
        cancelledBookings: cancelledBk.length,
        totalEnquiries: enqs.length,
        totalPackages: pkgCount || 0,
        totalFleet: fleetCount || 0,
        activeVehicles: activeFleetCount || 0,
        galleryImages: galleryCount || 0,
        monthlyGrowth
      });

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-ink-muted font-medium animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
      
      {/* 1. Header Section */}
      <DashboardHeader />

      {/* Date Filter */}
      <div className="flex justify-end">
        <div className="w-48 relative">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full appearance-none bg-surface backdrop-blur-md border border-border/50 rounded-xl h-11 px-4 text-ink font-medium outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all cursor-pointer"
          >
            <option value="1">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">This Year</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-ink-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <KPICards stats={stats} />

      {/* 3. Analytics Charts */}
      <AnalyticsCharts bookings={bookings} days={parseInt(dateFilter)} />

      {/* 4. Complex Grid: Schedule, Table, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Table) */}
        <div className="lg:col-span-8">
          <RecentBookingsTable bookings={bookings} onUpdate={fetchData} />
        </div>

        {/* Right Column (Schedule & Quick Actions) */}
        <div className="lg:col-span-4 space-y-6">
          <TodaySchedule bookings={bookings} />
          <QuickActions />
        </div>
        
      </div>
      
    </div>
  );
}
