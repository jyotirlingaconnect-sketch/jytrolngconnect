import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent-primary text-surface shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0":
              variant === "primary",
            "border border-accent-primary text-accent-primary bg-transparent hover:bg-accent-primary hover:text-surface":
              variant === "outline",
            "bg-transparent text-ink hover:text-accent-secondary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent-secondary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100":
              variant === "ghost",
            "h-11 px-6 py-2 text-[0.9375rem] tracking-[0.01em]": size === "default",
            "h-9 rounded-lg px-4 text-sm": size === "sm",
            "h-14 rounded-xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
