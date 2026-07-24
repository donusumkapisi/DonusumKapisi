import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColors } from "@/src/lib/theme-context";

export default function IlanlarLayout() {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <Stack screenOptions={{ headerTintColor: colors.ink }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[listingNumber]" options={{ title: t("nav.listingDetailTitle") }} />
    </Stack>
  );
}
