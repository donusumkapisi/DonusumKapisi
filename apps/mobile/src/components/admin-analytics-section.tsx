import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { SectionCard } from "@/src/components/section-card";

type Analytics = Awaited<ReturnType<typeof api.getAdminAnalytics>>;

export function AdminAnalyticsSection() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await api.getAdminAnalytics();
      setAnalytics(response);
    } catch {
      setAnalytics(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!analytics) return null;

  const { stats, topContractors, trends } = analytics;
  const maxTrendValue = Math.max(1, ...trends.map((t) => Math.max(t.listings, t.offers)));

  return (
    <SectionCard title="Analitik">
      <View style={styles.statsGrid}>
        <StatBox label="Toplam İlan" value={stats.totalListings} />
        <StatBox label="Yayında" value={stats.approvedListings} />
        <StatBox label="Toplam Teklif" value={stats.totalOffers} />
        <StatBox label="Dönüşüm" value={`%${stats.conversionRate.toFixed(1)}`} />
        <StatBox label="Müteahhit" value={stats.totalContractors} />
        <StatBox label="Doğrulanmış" value={stats.verifiedContractors} />
      </View>

      {topContractors.length > 0 && (
        <View style={styles.topSection}>
          <Text style={styles.subheading}>En Yüksek Puanlı Müteahhitler</Text>
          {topContractors.map((contractor) => (
            <View key={contractor.contractorId} style={styles.topRow}>
              <Text style={styles.topName}>{contractor.name ?? "Müteahhit"}</Text>
              <View style={styles.topRatingRow}>
                <Ionicons name="star" size={12} color={colors.ctaOrange} />
                <Text style={styles.topRating}>
                  {contractor.averageRating?.toFixed(1)} ({contractor.reviewCount})
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.trendSection}>
        <Text style={styles.subheading}>Aylık Trend</Text>
        <View style={styles.trendChart}>
          {trends.map((bucket) => (
            <View key={bucket.key} style={styles.trendColumn}>
              <View style={styles.trendBars}>
                <View
                  style={[
                    styles.trendBar,
                    { height: (bucket.listings / maxTrendValue) * 60, backgroundColor: colors.turquoise },
                  ]}
                />
                <View
                  style={[
                    styles.trendBar,
                    { height: (bucket.offers / maxTrendValue) * 60, backgroundColor: colors.ctaOrange },
                  ]}
                />
              </View>
              <Text style={styles.trendLabel}>{bucket.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    statBox: {
      flexBasis: "31%",
      flexGrow: 1,
      borderRadius: 12,
      backgroundColor: colors.mist,
      padding: 10,
      gap: 2,
    },
    statValue: { fontSize: 17, fontWeight: "800", color: colors.ink },
    statLabel: { fontSize: 10, color: colors.inkMuted },
    topSection: { marginTop: 8, gap: 6 },
    subheading: { fontSize: 12, fontWeight: "700", color: colors.turquoise, textTransform: "uppercase" },
    topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    topName: { fontSize: 13, color: colors.ink, flex: 1 },
    topRatingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    topRating: { fontSize: 12, fontWeight: "600", color: colors.inkMuted },
    trendSection: { marginTop: 8, gap: 6 },
    trendChart: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    trendColumn: { alignItems: "center", gap: 4, flex: 1 },
    trendBars: { flexDirection: "row", gap: 2, alignItems: "flex-end", height: 60 },
    trendBar: { width: 6, borderRadius: 2 },
    trendLabel: { fontSize: 9, color: colors.inkMuted },
  });
}
