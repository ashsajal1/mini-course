import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        accent: "border-transparent bg-teal-600 text-white",
        ghost: "border-transparent bg-muted text-muted-foreground",
        info: "border-transparent bg-sky-500 text-white",
        success: "border-transparent bg-green-600 text-white",
        warning: "border-transparent bg-amber-500 text-white",
      },
      size: {
        default: "",
        sm: "text-[0.7rem] px-1.5 py-0",
        lg: "text-sm px-3 py-1",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const legacyBadgeClass: Record<string, string> = {
  default: "badge",
  secondary: "badge badge-secondary",
  destructive: "badge badge-error",
  outline: "badge badge-outline",
  accent: "badge badge-accent",
  ghost: "badge badge-ghost",
  info: "badge badge-info",
  success: "badge badge-success",
  warning: "badge badge-warning",
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  const legacy = legacyBadgeClass[variant ?? "default"] ?? "badge"
  // keep legacy daisyUI classes for backwards compatibility with existing tests/shim
  return (
    <div className={cn(badgeVariants({ variant, size }), legacy, size === "sm" && "badge-sm", size === "lg" && "badge-lg", className)} {...props} />
  )
}

export { Badge, badgeVariants }
