"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (isMobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Fleet", href: "/fleet" },
    { name: "Packages", href: "/packages" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-bg/80 backdrop-blur-xl shadow-sm border-b border-border/50 py-3 md:py-4"
            : "bg-transparent py-5 md:py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50 relative">
            <div className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-accent-primary transition-colors">
              Jyotirling<span className="text-ink group-hover:text-accent-secondary transition-colors">Connect</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-all hover:text-accent-secondary relative group",
                  pathname === link.href ? "text-accent-primary" : "text-ink"
                )}
              >
                {link.name}
                <span 
                  className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-accent-primary transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )} 
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            <ThemeToggle />
            <Button asChild className="rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              <Link href="/booking">Book Your Yatra</Link>
            </Button>
          </div>

          {/* Mobile Toggle & Theme */}
          <div className="flex md:hidden items-center gap-3 z-50 relative">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-ink p-2 -mr-2 hover:bg-surface/50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Premium Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[400px] bg-bg border-l border-border/50 z-40 md:hidden shadow-2xl flex flex-col pt-24 pb-8 px-6 overflow-y-auto overscroll-contain"
            >
              <div className="flex flex-col space-y-2 flex-grow">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between py-4 text-xl font-display font-semibold transition-all border-b border-border/50 group",
                        pathname === link.href ? "text-accent-primary border-accent-primary/20" : "text-ink hover:text-accent-primary"
                      )}
                    >
                      {link.name}
                      <ChevronRight size={18} className={cn("transition-transform group-hover:translate-x-1", pathname === link.href ? "text-accent-primary opacity-100" : "text-ink-muted opacity-0 group-hover:opacity-50")} />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="pt-8 mt-auto"
              >
                <Button asChild className="w-full h-14 text-lg rounded-xl shadow-lg shadow-accent-primary/20">
                  <Link href="/booking">Book Your Yatra</Link>
                </Button>
                <p className="text-center text-xs text-ink-muted mt-6 uppercase tracking-wider font-semibold">
                  Premium Pilgrimage Services
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
