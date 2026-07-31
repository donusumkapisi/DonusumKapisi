import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { TextField } from "@/src/components/text-field";

export function ReviewForm({ offerId, onSubmitted }: { offerId: string; onSubmitted: () => void }) {
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.submitReview(offerId, { rating, comment: comment || undefined });
      onSubmitted();
    } catch {
      setError(t("review.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable key={value} onPress={() => setRating(value)}>
            <Ionicons
              name={value <= rating ? "star" : "star-outline"}
              size={22}
              color={colors.ctaOrange}
            />
          </Pressable>
        ))}
      </View>
      <TextField
        label={t("review.commentLabel")}
        value={comment}
        onChangeText={setComment}
        multiline
        placeholder={t("review.commentPlaceholder")}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={t("review.submit")}
        size="sm"
        icon="send-outline"
        loading={isSubmitting}
        onPress={submit}
      />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { gap: 8, marginTop: 8, backgroundColor: colors.mist, borderRadius: 12, padding: 10 },
    starsRow: { flexDirection: "row", gap: 4 },
    error: { fontSize: 12, color: colors.ctaRed },
  });
}
