import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useColors } from "@/src/lib/theme-context";
import { AiPriceEstimateModal } from "@/src/components/ai-price-estimate-modal";

/** Tab bar ~56 + safe area; bubble sits just above it on the right edge. */
const TAB_BAR_BASE = 56;

export function AiPriceEstimateBubble() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <View
        pointerEvents="box-none"
        style={[
          styles.anchor,
          {
            bottom: TAB_BAR_BASE + Math.max(insets.bottom, 8) + 12,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("priceEstimate.bubbleA11y")}
          onPress={() => setOpen(true)}
          style={({ pressed }) => [
            styles.bubble,
            {
              backgroundColor: colors.turquoise,
              shadowColor: colors.turquoise,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="sparkles" size={18} color="#fff" />
          </View>
          <Text style={styles.label} numberOfLines={3}>
            {t("priceEstimate.bubbleLabel")}
          </Text>
        </Pressable>
      </View>

      <AiPriceEstimateModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    right: 0,
    zIndex: 50,
    elevation: 50,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: 148,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 14,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: -2, height: 4 },
    elevation: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  label: {
    flexShrink: 1,
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    letterSpacing: 0.1,
  },
});
