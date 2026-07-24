import { useMemo } from "react";
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

export function SearchField({
  containerStyle,
  ...props
}: TextInputProps & { containerStyle?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.card, containerStyle]}>
      <Ionicons name="search-outline" size={18} color={colors.inkMuted} />
      <TextInput style={styles.input} placeholderTextColor={colors.inkMuted} {...props} />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      height: 50,
      borderRadius: 16,
      backgroundColor: colors.paper,
      paddingHorizontal: 16,
      shadowColor: colors.ink,
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    input: { flex: 1, fontSize: 15, color: colors.ink },
  });
}
