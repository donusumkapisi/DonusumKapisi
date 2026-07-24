import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

export type StatusTone = "positive" | "warning" | "negative" | "neutral";

export function toneColorsFor(colors: Colors): Record<StatusTone, string> {
  return {
    positive: colors.turquoise,
    warning: colors.ctaOrange,
    negative: colors.ctaRed,
    neutral: colors.inkMuted,
  };
}

export function useToneColors() {
  const colors = useColors();
  return useMemo(() => toneColorsFor(colors), [colors]);
}

function toneStylesFor(colors: Colors): Record<StatusTone, { backgroundColor: string; color: string }> {
  const tones = toneColorsFor(colors);
  return {
    positive: { backgroundColor: `${colors.turquoise}1a`, color: tones.positive },
    warning: { backgroundColor: `${colors.ctaOrange}1a`, color: tones.warning },
    negative: { backgroundColor: `${colors.ctaRed}1a`, color: tones.negative },
    neutral: { backgroundColor: colors.mist, color: tones.neutral },
  };
}

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const colors = useColors();
  const toneStyles = useMemo(() => toneStylesFor(colors), [colors]);
  const styles = useMemo(() => createStyles(), []);
  return <Text style={[styles.badge, toneStyles[tone]]}>{label}</Text>;
}

function createStyles() {
  return StyleSheet.create({
    badge: {
      alignSelf: "flex-start",
      fontSize: 11,
      fontWeight: "700",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      overflow: "hidden",
    },
  });
}
