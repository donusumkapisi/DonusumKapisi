import { useMemo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

export function PageHero({
  title,
  subtitle,
  compact = false,
  left,
  right,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
  left?: ReactNode;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.hero,
        { paddingTop: insets.top + (compact ? 14 : 18), paddingBottom: compact ? 22 : 40 },
      ]}
    >
      <View style={styles.row}>
        {left}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    hero: {
      backgroundColor: colors.deep,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    title: { fontSize: 21, fontWeight: "800", color: colors.onDark },
    subtitle: { marginTop: 6, fontSize: 13, color: colors.turquoiseSoft },
  });
}
