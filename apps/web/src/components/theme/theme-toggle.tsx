"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "system", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
] as const;

export function ThemeToggle({
  className,
  invert = false,
}: {
  className?: string;
  /** Use on permanently-dark surfaces (e.g. the floating navbar) regardless of site theme. */
  invert?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border p-1",
        invert ? "border-white/15 bg-white/5" : "border-hairline bg-surface/60",
        className
      )}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors",
              invert
                ? isActive
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80"
                : isActive
                  ? "bg-card text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
