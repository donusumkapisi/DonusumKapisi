import { Stack } from "expo-router";
import { useColors } from "@/src/lib/theme-context";

export default function PanelLayout() {
  const colors = useColors();
  return (
    <Stack screenOptions={{ headerTintColor: colors.ink }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
