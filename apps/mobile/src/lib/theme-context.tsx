import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { PALETTES, type ColorScheme, type Colors } from "./theme";

type ThemePreference = "system" | ColorScheme;

const PREFERENCE_KEY = "donusumkapisi_theme_preference";

type ThemeContextValue = {
  scheme: ColorScheme;
  colors: Colors;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    SecureStore.getItemAsync(PREFERENCE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreferenceState(stored);
      }
    });
  }, []);

  function setPreference(next: ThemePreference) {
    setPreferenceState(next);
    SecureStore.setItemAsync(PREFERENCE_KEY, next);
  }

  const scheme: ColorScheme = preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const value = useMemo(
    () => ({ scheme, colors: PALETTES[scheme], preference, setPreference }),
    [scheme, preference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useColors/useTheme, ThemeProvider içinde kullanılmalı.");
  return ctx;
}

export function useColors() {
  return useThemeContext().colors;
}

export function useTheme() {
  const { scheme, preference, setPreference } = useThemeContext();
  return { scheme, preference, setPreference };
}
