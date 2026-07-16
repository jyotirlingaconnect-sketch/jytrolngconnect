"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Bell, Settings, User } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardHeader() {
  const [time, setTime] = useState(new Date());
  const [adminEmail, setAdminEmail] = useState<string>("Admin");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch logged in admin
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        // Extract name from email or just use the prefix
        const name = data.user.email.split("@")[0];
        setAdminEmail(name.charAt(0).toUpperCase() + name.slice(1));
      }
    });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-surface/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-display font-bold text-ink flex items-center gap-2">
          Good Morning, {adminEmail} <span className="animate-bounce-slow">👋</span>
        </h1>
        <p className="text-ink-muted mt-2">
          Welcome back to Jyotirling Connect Dashboard. Here's what's happening today.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm font-medium text-ink-muted bg-bg/50 px-4 py-2 rounded-full inline-flex border border-border/50">
          <span>{format(time, "EEEE, MMMM do yyyy")}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
          <span>{format(time, "hh:mm:ss a")}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 rounded-2xl bg-bg border border-border/50 text-ink-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all group shadow-sm">
          <Bell size={20} className="group-hover:animate-wiggle" />
          <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-error border-2 border-bg" />
        </button>
        <Link href="/admin/settings" className="p-3 rounded-2xl bg-bg border border-border/50 text-ink-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all shadow-sm">
          <Settings size={20} />
        </Link>
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-ink">{adminEmail}</p>
            <p className="text-xs text-ink-muted">Super Admin</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white shadow-md">
            <User size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
