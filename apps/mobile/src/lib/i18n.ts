import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "@/src/locales/tr.json";
import en from "@/src/locales/en.json";
import ar from "@/src/locales/ar.json";
import ru from "@/src/locales/ru.json";

export const SUPPORTED_LANGUAGES = ["tr", "en", "ar", "ru"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ar: "🇸🇦",
  ru: "🇷🇺",
};

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
    ar: { translation: ar },
    ru: { translation: ru },
  },
  lng: "tr",
  fallbackLng: "tr",
  interpolation: { escapeValue: false },
});

export default i18n;
