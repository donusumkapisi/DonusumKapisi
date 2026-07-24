"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Premium auth input — refined height, soft surface, clay focus ring.
 */
function GlowInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-hairline bg-surface/70 px-4 text-sm text-ink outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink-muted/55 focus-visible:border-clay/45 focus-visible:bg-paper focus-visible:ring-[3px] focus-visible:ring-clay/15 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { GlowInput };
