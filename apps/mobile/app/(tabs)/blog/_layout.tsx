import { Stack } from "expo-router";
import { useColors } from "@/src/lib/theme-context";

export default function BlogLayout() {
  const colors = useColors();
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
      <Stack.Screen name="index" options={{ title: "Blog" }} />
      <Stack.Screen name="[slug]" options={{ title: "Yazı" }} />
    </Stack>
  );
}
