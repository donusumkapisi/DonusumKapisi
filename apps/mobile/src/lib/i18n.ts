import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "@/src/locales/tr.json";
import en from "@/src/locales/en.json";
import ar from "@/src/locales/ar.json";
import ru from "@/src/locales/ru.json";
import zh from "@/src/locales/zh.json";

export const SUPPORTED_LANGUAGES = ["tr", "en", "ar", "ru", "zh"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
  zh: "简体中文",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ar: "🇸🇦",
  ru: "🇷🇺",
  zh: "🇨🇳",
};

/** BCP 47 tags for Intl date/number formatting. */
export const INTL_LOCALES: Record<SupportedLanguage, string> = {
  tr: "tr-TR",
  en: "en-US",
  ar: "ar-SA",
  ru: "ru-RU",
  zh: "zh-CN",
};

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
    ar: { translation: ar },
    ru: { translation: ru },
    zh: { translation: zh },
  },
  lng: "tr",
  fallbackLng: "tr",
  interpolation: { escapeValue: false },
});

export default i18n;
