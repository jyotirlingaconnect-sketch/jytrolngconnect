import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary",
        {
          "border-transparent bg-accent-secondary text-ink": variant === "default",
          "border-transparent bg-success text-white": variant === "success",
          "text-ink border-border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
