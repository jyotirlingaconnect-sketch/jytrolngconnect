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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface/50 backdrop-blur-xl border border-border/50 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-ink flex items-center gap-2 flex-wrap">
          Good Morning, {adminEmail} <span className="animate-bounce-slow">👋</span>
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Welcome back to Jyotirling Connect Dashboard.
        </p>
        <div className="flex items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm font-medium text-ink-muted bg-bg/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex border border-border/50 flex-wrap">
          <span>{format(time, "EEEE, MMMM do yyyy")}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
          <span>{format(time, "hh:mm:ss a")}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2.5 sm:p-3 rounded-2xl bg-bg border border-border/50 text-ink-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all group shadow-sm">
          <Bell size={18} className="group-hover:animate-wiggle" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-error border-2 border-bg" />
        </button>
        <Link href="/admin/settings" className="p-2.5 sm:p-3 rounded-2xl bg-bg border border-border/50 text-ink-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all shadow-sm">
          <Settings size={18} />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-ink">{adminEmail}</p>
            <p className="text-xs text-ink-muted">Super Admin</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white shadow-md">
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
