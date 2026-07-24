import { useMemo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.paper,
      borderRadius: 18,
      padding: 16,
      gap: 12,
      shadowColor: colors.ink,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
    },
    title: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.turquoise,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    body: { gap: 12 },
  });
}
