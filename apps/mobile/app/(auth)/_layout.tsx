import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors } from "@/src/lib/theme-context";

export default function AuthLayout() {
  const colors = useColors();
  const router = useRouter();

  function renderBackButton(tintColor: string) {
    return (
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/panel"))}
        hitSlop={12}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color={tintColor} />
      </Pressable>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.paper },
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      <Stack.Screen
        name="giris"
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerTintColor: colors.onDark,
          headerLeft: () => renderBackButton(colors.onDark),
        }}
      />
      <Stack.Screen
        name="kayit"
        options={{
          headerTintColor: colors.ink,
          headerLeft: () => renderBackButton(colors.ink),
        }}
      />
      <Stack.Screen
        name="sifremi-unuttum"
        options={{
          headerTintColor: colors.ink,
          headerLeft: () => renderBackButton(colors.ink),
        }}
      />
      <Stack.Screen
        name="sifre-sifirla"
        options={{
          headerTintColor: colors.ink,
          headerLeft: () => renderBackButton(colors.ink),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: { marginRight: 8, padding: 4 },
});
