"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  Settings,
  Phone,
  LogOut,
  Menu,
  X,
  Car
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Close drawer on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [isMobileOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <div className="min-h-[100dvh] bg-bg flex items-center justify-center p-4">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-ink-muted text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Packages", href: "/admin/packages", icon: Package },
    { name: "Fleet", href: "/admin/fleet", icon: Car },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Bookings", href: "/admin/bookings", icon: BookOpen },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Contact Info", href: "/admin/contact", icon: Phone },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="min-h-[100dvh] bg-bg flex flex-col md:flex-row">
      {/* ── Mobile Sticky Topbar ──────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-surface border-b border-border shadow-sm">
        <div className="font-display font-bold text-lg text-accent-primary">Admin Panel</div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-ink hover:bg-bg transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ── Backdrop (mobile only) ────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      {/*
        Mobile: fixed off-canvas drawer — translates in/out from the left.
        Desktop (md+): static sidebar, always visible, no transform needed.
      */}
      <aside
        id="mobile-nav-drawer"
        className={cn(
          // Shared layout
          "flex flex-col bg-surface border-r border-border w-64",
          // Mobile: fixed full-height drawer above backdrop
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
          "md:static md:translate-x-0 md:z-auto md:flex-shrink-0",
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Sidebar brand and close button */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border shrink-0">
          <div className="font-display font-bold text-xl text-accent-primary">Admin Panel</div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button
              onClick={closeMobile}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-ink hover:bg-bg transition-colors"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav list — scrollable if items overflow */}
        <nav className="flex-1 overflow-y-auto py-4 overscroll-contain">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent-primary text-surface"
                        : "text-ink-muted hover:bg-accent-primary/10 hover:text-accent-primary"
                    )}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout — pinned to bottom */}
        <div className="shrink-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
