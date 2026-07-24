import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./i18n";
import { getDeviceLanguage } from "./device-locale";

const PREFERENCE_KEY = "donusumkapisi_language_preference";

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (next: SupportedLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("tr");

  useEffect(() => {
    SecureStore.getItemAsync(PREFERENCE_KEY).then((stored) => {
      const deviceLanguage = getDeviceLanguage();
      const initial = stored && isSupportedLanguage(stored)
        ? stored
        : isSupportedLanguage(deviceLanguage)
          ? deviceLanguage
          : "tr";
      setLanguageState(initial);
      i18n.changeLanguage(initial);
    });
  }, []);

  function setLanguage(next: SupportedLanguage) {
    setLanguageState(next);
    i18n.changeLanguage(next);
    SecureStore.setItemAsync(PREFERENCE_KEY, next);
  }

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage, LanguageProvider içinde kullanılmalı.");
  return ctx;
}
