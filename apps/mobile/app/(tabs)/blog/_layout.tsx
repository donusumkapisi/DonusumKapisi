import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColors } from "@/src/lib/theme-context";

export default function BlogLayout() {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.ink,
        headerStyle: { backgroundColor: colors.paper },
        headerTitleStyle: { color: colors.ink, fontWeight: "700" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      <Stack.Screen name="index" options={{ title: t("tabs.blog") }} />
      <Stack.Screen name="[slug]" options={{ title: t("nav.blogPostTitle") }} />
    </Stack>
  );
}
