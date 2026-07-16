"use client";

import { 
  BookOpen, CalendarDays, CheckCircle2, AlertCircle, 
  Car, Package, Image as ImageIcon, MessageSquare, TrendingUp, XCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEnquiries: number;
  totalPackages: number;
  totalFleet: number;
  galleryImages: number;
  activeVehicles: number;
  monthlyGrowth: number;
}

export function KPICards({ stats }: { stats: DashboardStats }) {
  const kpiData = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: `+${stats.monthlyGrowth}% this month`,
      trendColor: "text-success",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: CalendarDays,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      trend: "Based on travel date",
      trendColor: "text-ink-muted",
    },
    {
      title: "Pending Confirmations",
      value: stats.pendingBookings,
      icon: AlertCircle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      trend: "Action required",
      trendColor: "text-orange-500",
    },
    {
      title: "Completed Trips",
      value: stats.completedBookings,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "Successfully finished",
      trendColor: "text-green-500",
    },
    {
      title: "Active Fleet",
      value: stats.activeVehicles,
      icon: Car,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      trend: `${stats.totalFleet} total vehicles`,
      trendColor: "text-ink-muted",
    },
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "Active pilgrimage routes",
      trendColor: "text-ink-muted",
    },
    {
      title: "Customer Enquiries",
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      trend: "From contact form",
      trendColor: "text-ink-muted",
    },
    {
      title: "Cancelled",
      value: stats.cancelledBookings,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      trend: "Lost bookings",
      trendColor: "text-red-500",
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {kpiData.map((kpi, idx) => (
        <motion.div key={idx} variants={item}>
          <Card className="overflow-hidden bg-surface/50 backdrop-blur-xl border-border/50 hover:shadow-xl hover:border-accent-primary/30 transition-all duration-300 group rounded-3xl h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon size={28} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-bg border border-border/50 text-ink-muted">
                  <TrendingUp size={14} className={kpi.trendColor} />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-display font-bold text-ink mb-1 group-hover:text-accent-primary transition-colors">
                  <CountUp end={kpi.value} duration={2} separator="," />
                </h3>
                <p className="text-sm font-semibold text-ink-muted">{kpi.title}</p>
                <p className={`text-xs mt-2 font-medium ${kpi.trendColor}`}>
                  {kpi.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
