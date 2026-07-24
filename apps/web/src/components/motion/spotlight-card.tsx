"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * White card whose border glows with a soft clay radial gradient that
 * follows the cursor. The gradient position is a motion value updated
 * directly (bypassing React state) so the hover tracking stays smooth.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--clay) 14%, transparent), transparent 75%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-hairline bg-paper shadow-[0_1px_2px_rgb(22_52_73_/_0.04)] transition-colors duration-300 hover:border-clay/35",
        className
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
