"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";

export function AutoResume() {
  const { status } = useSession();
  const { pendingAction, setPendingAction } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && pendingAction) {
      const action = pendingAction;
      
      const justLoggedIn = sessionStorage.getItem("loginSuccess") === "true";
      const delay = justLoggedIn ? 2500 : 0;
      
      const timer = setTimeout(() => {
        setPendingAction(null); // Clear it before navigating
        router.push(action);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [status, pendingAction, router, setPendingAction]);

  return null;
}
