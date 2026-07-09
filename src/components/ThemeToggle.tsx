"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full border border-border" />; // placeholder
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface",
        isDark ? "bg-surface shadow-[0_0_15px_rgba(212,175,106,0.2)]" : "bg-transparent"
      )}
      aria-label="Toggle theme"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-all duration-500",
          isDark ? "text-accent-secondary" : "text-ink"
        )}
      >
        {/* Diya Base */}
        <path
          d="M2 13C2 17.4183 6.47715 21 12 21C17.5228 21 22 17.4183 22 13H2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isDark ? "currentColor" : "none"}
        />
        <path
          d="M12 21V23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Flame */}
        <path
          d="M12 13C12 13 8 9 12 3C16 9 12 13 12 13Z"
          stroke={isDark ? "var(--accent-primary)" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isDark ? "var(--accent-primary)" : "none"}
          className={cn(
            isDark && "origin-bottom animate-[flicker_3s_ease-in-out_infinite]"
          )}
        />
      </svg>
    </button>
  );
}
