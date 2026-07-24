import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

type Variant = "primary" | "outline" | "ghost" | "danger" | "dark";
type Size = "md" | "sm";

function variantStylesFor(colors: Colors): Record<Variant, { container: object; text: string }> {
  return {
    primary: {
      container: {
        backgroundColor: colors.turquoise,
        shadowColor: colors.turquoise,
        shadowOpacity: 0.28,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
      },
      text: "#fff",
    },
    outline: {
      container: { backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.turquoise },
      text: colors.turquoise,
    },
    ghost: {
      container: { backgroundColor: colors.mist },
      text: colors.ink,
    },
    danger: {
      container: { backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.ctaRed },
      text: colors.ctaRed,
    },
    dark: {
      container: { backgroundColor: colors.deep },
      text: "#fff",
    },
  };
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  icon,
  loading,
  disabled,
  style,
  ...props
}: PressableProps & {
  title: string;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
}) {
  const colors = useColors();
  const isDisabled = disabled || loading;
  const variantStyle = useMemo(() => variantStylesFor(colors), [colors])[variant];

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        size === "sm" ? styles.sm : styles.md,
        variantStyle.container,
        state.pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={size === "sm" ? 14 : 16} color={variantStyle.text} />}
          <Text style={[styles.text, size === "sm" && styles.textSm, { color: variantStyle.text }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  md: { height: 50 },
  sm: { height: 38, paddingHorizontal: 14, borderRadius: 12 },
  content: { flexDirection: "row", alignItems: "center", gap: 6 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 15, fontWeight: "700", letterSpacing: 0.2 },
  textSm: { fontSize: 13 },
});
