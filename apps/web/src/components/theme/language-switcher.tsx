"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Globe } from "lucide-react";
import { setLocaleAction } from "@/lib/actions/locale";
import { LOCALE_FLAGS, LOCALE_NAMES, SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ invert = false }: { invert?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function select(next: Locale) {
    setIsOpen(false);
    startTransition(() => {
      setLocaleAction(next);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        aria-label={t("language")}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
          invert
            ? "border-white/15 bg-white/5 text-white/80 hover:text-white"
            : "border-hairline bg-surface/60 text-ink-muted hover:text-ink"
        )}
      >
        <Globe className="size-3.5" />
        <span>{LOCALE_FLAGS[locale]}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden />
          <div className="absolute top-full right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-hairline bg-card p-1 shadow-lg">
            {SUPPORTED_LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => select(option)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-surface"
              >
                <span className="flex items-center gap-2">
                  <span>{LOCALE_FLAGS[option]}</span>
                  {LOCALE_NAMES[option]}
                </span>
                {option === locale && <Check className="size-3.5 text-clay" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
