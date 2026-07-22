"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";

interface ProtectedActionProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export function ProtectedAction({ href, onClick, children, className }: ProtectedActionProps) {
  const { data: session, status } = useSession();
  const { openModal, setPendingAction } = useAuthModal();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    if (status === "loading") {
      return; // Do nothing while checking session
    }

    if (status === "authenticated") {
      if (href) {
        router.push(href);
      }
    } else {
      // Unauthenticated -> store intent and open modal
      if (href) {
        setPendingAction(href);
      }
      openModal();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
