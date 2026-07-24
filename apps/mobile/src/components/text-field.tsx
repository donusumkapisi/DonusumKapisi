import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

export function TextField({ label, ...props }: TextInputProps & { label: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.inkMuted} style={styles.input} {...props} />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    wrapper: { gap: 6 },
    label: { fontSize: 13, fontWeight: "500", color: colors.inkMuted },
    input: {
      height: 46,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.mist,
      paddingHorizontal: 14,
      fontSize: 15,
      color: colors.ink,
    },
  });
}
