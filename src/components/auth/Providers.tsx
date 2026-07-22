"use client";

import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { AutoResume } from "@/components/auth/AutoResume";

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        {children}
        <LoginModal />
        <AutoResume />
      </AuthModalProvider>
    </SessionProvider>
  );
}
