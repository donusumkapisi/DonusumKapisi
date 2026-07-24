"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-clay-soft",
        outline:
          "border-hairline bg-transparent text-foreground hover:border-clay/40 hover:bg-surface",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--surface),var(--ink)_6%)]",
        ghost: "hover:bg-surface hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        cta: "bg-clay text-white shadow-[0_0_28px_-10px_var(--clay)] hover:bg-clay-soft hover:shadow-[0_0_34px_-8px_var(--clay)]",
        "cta-red":
          "bg-danger text-white shadow-[0_0_28px_-10px_var(--danger)] hover:bg-danger-soft hover:shadow-[0_0_34px_-8px_var(--danger)]",
        "cta-orange":
          "bg-warning text-white shadow-[0_0_28px_-10px_var(--warning)] hover:bg-warning-soft hover:shadow-[0_0_34px_-8px_var(--warning)]",
        "cta-blue":
          "bg-info text-white shadow-[0_0_28px_-10px_var(--info)] hover:bg-info-soft hover:shadow-[0_0_34px_-8px_var(--info)]",
        "cta-yellow":
          "bg-highlight text-ink shadow-[0_0_28px_-10px_var(--highlight)] hover:bg-highlight-soft hover:shadow-[0_0_34px_-8px_var(--highlight)]",
        link: "text-clay underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Motion-enhanced variants of the two possible roots, hoisted so they are
// created once rather than on every render.
const MotionSlot = motion.create(Slot.Root)
const MotionButton = motion.create("button")

// Every button in the system gets the same quiet tactile response —
// a slight lift on hover, a slight press on tap — instead of ad-hoc effects.
const TAP_TRANSITION = { type: "spring", stiffness: 500, damping: 30 } as const

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: HTMLMotionProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? MotionSlot : MotionButton

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={TAP_TRANSITION}
      {...props}
    />
  )
}

export { Button, buttonVariants }
