"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";

export function LoginModal() {
  const { isOpen, openModal, closeModal, pendingAction } = useAuthModal();
  const { data: session, status } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check for login success upon return
  useEffect(() => {
    if (typeof window !== "undefined") {
      const justLoggedIn = sessionStorage.getItem("loginSuccess");
      if (justLoggedIn === "true" && status === "authenticated") {
        setIsSuccess(true);
        openModal();
        
        // Close modal after 2.5 seconds
        const timer = setTimeout(() => {
          setIsSuccess(false);
          sessionStorage.removeItem("loginSuccess");
          closeModal();
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [status, openModal, closeModal]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading && !isSuccess) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, isSuccess, closeModal]);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem("loginSuccess", "true");
      await signIn("google", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      sessionStorage.removeItem("loginSuccess");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && !isSuccess && closeModal()}
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden bg-white/70 dark:bg-bg/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)] pointer-events-auto relative"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              {!isLoading && !isSuccess && (
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary z-10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-black/60 dark:text-white/60" />
                </button>
              )}

              {/* Success State */}
              {isSuccess ? (
                <div className="p-10 text-center flex flex-col items-center justify-center min-h-[360px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-display font-bold text-black dark:text-white mb-2"
                  >
                    Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-black/70 dark:text-white/70 text-sm"
                  >
                    Resuming your journey...
                  </motion.p>
                </div>
              ) : (
                /* Login State */
                <>
                  {/* Hero Header Area */}
                  <div className="relative pt-12 pb-6 px-8 flex flex-col items-center text-center overflow-hidden bg-gradient-to-b from-accent-primary/10 to-transparent">
                    {/* Animated Temple/Aura SVG */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                      <div className="w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl animate-pulse" />
                    </div>
                    
                    <motion.div 
                      initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="relative z-10 w-20 h-20 mb-6 bg-gradient-to-tr from-[#D4AF6A] to-[#F5D08B] rounded-2xl flex items-center justify-center shadow-xl shadow-accent-primary/20"
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M3 21h18" />
                        <path d="M12 3v18" />
                        <path d="M5 21v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                        <path d="M9 15v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                      </svg>
                    </motion.div>

                    <h2 id="modal-title" className="relative z-10 text-2xl font-display font-bold text-black dark:text-white mb-2 tracking-tight">
                      Welcome to Jyotirling Connect
                    </h2>
                    
                    <p className="relative z-10 text-black/70 dark:text-white/70 text-[14px] leading-relaxed max-w-sm">
                      {pendingAction 
                        ? "Sign in securely to continue your spiritual journey and complete your booking in just a few seconds."
                        : "Sign in to access premium features, manage your bookings, and experience seamless travel."}
                    </p>
                  </div>

                  <div className="px-8 pb-10">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="group w-full relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-black dark:text-white font-semibold shadow-sm hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-80 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {/* Hover effect glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                      
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                          <span className="text-[15px] font-medium tracking-wide relative z-10">Redirecting to Google...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <span className="text-[15px] font-semibold tracking-wide relative z-10">Continue with Google</span>
                        </>
                      )}
                    </button>
                    
                    <div className="mt-6 text-center">
                      <p className="text-[13px] text-black/50 dark:text-white/50 leading-relaxed">
                        By continuing, you agree to our <a href="/terms-conditions" className="font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white underline decoration-black/20 dark:decoration-white/20 underline-offset-2 transition-colors">Terms of Service</a> and <a href="/privacy-policy" className="font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white underline decoration-black/20 dark:decoration-white/20 underline-offset-2 transition-colors">Privacy Policy</a>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
