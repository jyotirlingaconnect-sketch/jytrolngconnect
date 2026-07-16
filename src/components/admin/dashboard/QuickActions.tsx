"use client";

import Link from "next/link";
import { PlusCircle, Package, Car, Image as ImageIcon, Settings, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function QuickActions() {
  const actions = [
    {
      label: "New Booking",
      icon: PlusCircle,
      href: "/admin/bookings/new",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Add Package",
      icon: Package,
      href: "/admin/packages/new",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      label: "Add Fleet",
      icon: Car,
      href: "/admin/fleet/new",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      label: "Upload Gallery",
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20"
    },
    {
      label: "Enquiries",
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-500",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20"
    }
  ];

  return (
    <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm h-full">
      <CardHeader className="p-6 border-b border-border/50">
        <CardTitle className="text-xl font-display font-bold text-ink">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.href} className="group block">
              <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-md ${action.bg} ${action.border}`}>
                <action.icon size={24} className={`${action.color} mb-2`} />
                <span className="text-sm font-medium text-ink text-center">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
