"use client";

import { useRef, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  BookOpen,
  CalendarDays,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

function getInitials(name?: string | null): string {
  if (!name) return "JC";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const user = session?.user;

  const menuItems = [
    { label: "My Profile", href: "/profile", icon: User },
    { label: "My Bookings", href: "/profile#bookings", icon: BookOpen },
    { label: "Upcoming Trips", href: "/profile#upcoming", icon: CalendarDays },
    { label: "Account Settings", href: "/profile#settings", icon: Settings, disabled: true },
    { label: "Help & Support", href: "/contact", icon: HelpCircle, disabled: true },
  ];

  return (
    <div ref={containerRef} className="relative pointer-events-auto">
      {/* Avatar Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 250 }}
        onClick={() => setOpen((v) => !v)}
        className="group relative flex items-center justify-center rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary/60 p-1"
        aria-label="Open profile menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden ring-2 ring-black/10 dark:ring-white/20 group-hover:ring-accent-primary/60 transition-all">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Profile"}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#D4AF6A] to-[#c9973a] text-white text-xs font-bold">
              {getInitials(user?.name)}
            </span>
          )}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden bg-white dark:bg-[#111111] border border-black/5 dark:border-white/10 shadow-2xl shadow-black/20 z-[200]"
          >
            {/* User header */}
            <div className="flex items-center gap-3 p-4 border-b border-black/5 dark:border-white/10 bg-gradient-to-br from-[#D4AF6A]/10 to-transparent">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden ring-2 ring-[#D4AF6A]/40">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Profile"}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#D4AF6A] to-[#c9973a] text-white text-base font-bold">
                    {getInitials(user?.name)}
                  </span>
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black dark:text-white truncate">
                  {user?.name ?? "Pilgrim"}
                </p>
                <p className="text-xs text-black/50 dark:text-white/50 truncate">
                  {user?.email}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#D4AF6A]/15 px-2 py-0.5 text-[10px] font-medium text-[#c9973a]">
                  ✦ Verified Traveller
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.disabled ? "#" : item.href}
                  onClick={() => !item.disabled && setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    item.disabled
                      ? "opacity-40 cursor-not-allowed text-black/40 dark:text-white/40"
                      : "text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-[10px] rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
