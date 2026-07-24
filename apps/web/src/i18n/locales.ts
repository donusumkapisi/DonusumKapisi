export const SUPPORTED_LOCALES = ["tr", "en", "ar", "ru"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_NAMES: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ar: "🇸🇦",
  ru: "🇷🇺",
};

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
