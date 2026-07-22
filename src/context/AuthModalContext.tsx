"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  pendingAction: string | null;
  setPendingAction: (action: string | null) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingActionState] = useState<string | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const setPendingAction = (action: string | null) => {
    setPendingActionState(action);
    if (action) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingAction", action);
      }
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pendingAction");
      }
    }
  };

  // On mount, initialize from sessionStorage if exists
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pendingAction");
      if (stored) {
        setPendingActionState(stored);
      }
    }
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal, pendingAction, setPendingAction }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
