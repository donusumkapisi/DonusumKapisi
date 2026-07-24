import { useMemo } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  type Theme,
} from "@react-navigation/native";
import { AuthProvider } from "@/src/lib/auth-context";
import { ThemeProvider, useColors, useTheme } from "@/src/lib/theme-context";
import { LanguageProvider } from "@/src/lib/i18n-context";

function RootNavigation() {
  const { scheme } = useTheme();
  const colors = useColors();

  const navigationTheme = useMemo<Theme>(() => {
    const base = scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.turquoise,
        background: colors.paper,
        card: colors.paper,
        text: colors.ink,
        border: colors.hairline,
        notification: colors.ctaRed,
      },
    };
  }, [scheme, colors]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
