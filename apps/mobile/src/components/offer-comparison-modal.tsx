import { useMemo } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { OfferStatus } from "@donusum-kapisi/shared";
import { formatPriceRange, type Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";

const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  PENDING: "Yeni Teklif",
  INTERESTED: "İlgileniliyor",
  DECLINED: "İlgilenilmedi",
  WITHDRAWN: "Geri Çekildi",
};

export type OfferForComparison = {
  id: string;
  contractorName: string | null;
  priceMin: number;
  priceMax: number;
  durationMonths: number | null;
  status: OfferStatus;
  rating: { averageRating: number | null; reviewCount: number };
};

export function OfferComparisonModal({
  visible,
  offers,
  onClose,
}: {
  visible: boolean;
  offers: OfferForComparison[];
  onClose: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Teklifleri Karşılaştır</Text>
        <ScrollView contentContainerStyle={{ gap: 10 }}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.card}>
              <Text style={styles.contractorName}>{offer.contractorName ?? "Müteahhit"}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Teklif</Text>
                <Text style={styles.value}>{formatPriceRange(offer.priceMin, offer.priceMax)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Süre</Text>
                <Text style={styles.value}>
                  {offer.durationMonths ? `${offer.durationMonths} ay` : "—"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Puan</Text>
                {offer.rating.reviewCount > 0 ? (
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color={colors.ctaOrange} />
                    <Text style={styles.value}>
                      {offer.rating.averageRating?.toFixed(1)} ({offer.rating.reviewCount})
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.value}>—</Text>
                )}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Durum</Text>
                <Text style={styles.value}>{OFFER_STATUS_LABELS[offer.status]}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <Button title="Kapat" variant="outline" onPress={onClose} />
      </View>
    </Modal>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.paper, padding: 20, paddingTop: 60, gap: 16 },
    title: { fontSize: 20, fontWeight: "800", color: colors.ink },
    card: {
      borderRadius: 16,
      backgroundColor: colors.mist,
      padding: 14,
      gap: 6,
    },
    contractorName: { fontSize: 15, fontWeight: "700", color: colors.ink, marginBottom: 4 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    label: { fontSize: 12, color: colors.inkMuted },
    value: { fontSize: 13, fontWeight: "600", color: colors.ink },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  });
}
