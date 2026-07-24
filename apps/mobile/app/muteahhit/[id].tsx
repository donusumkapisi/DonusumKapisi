import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { api, type PublicContractorProfile } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { PageHero } from "@/src/components/page-hero";
import { SectionCard } from "@/src/components/section-card";

export default function ContractorProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [profile, setProfile] = useState<PublicContractorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getPublicContractorProfile(id);
      setProfile(response);
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <PageHero
        title={profile?.name ?? "Müteahhit"}
        left={
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={colors.onDark} />
          </Pressable>
        }
      />

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={colors.turquoise} />
      ) : !profile ? (
        <Text style={styles.message}>Profil bulunamadı.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.summaryRow}>
            {profile.profile?.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.turquoise} />
                <Text style={styles.verifiedText}>Doğrulanmış</Text>
              </View>
            )}
            {profile.ratingSummary.reviewCount > 0 ? (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={colors.ctaOrange} />
                <Text style={styles.ratingValue}>
                  {profile.ratingSummary.averageRating?.toFixed(1)}
                </Text>
                <Text style={styles.ratingCount}>
                  ({profile.ratingSummary.reviewCount} değerlendirme)
                </Text>
              </View>
            ) : (
              <Text style={styles.ratingCount}>Henüz değerlendirme yok</Text>
            )}
          </View>

          {profile.profile?.about && (
            <SectionCard title="Hakkında">
              <Text style={styles.about}>{profile.profile.about}</Text>
            </SectionCard>
          )}

          {profile.portfolio.length > 0 && (
            <SectionCard title="Tamamlanan Projeler">
              {profile.portfolio.map((item) => (
                <View key={item.id} style={styles.portfolioItem}>
                  <Text style={styles.portfolioTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.portfolioDescription}>{item.description}</Text>
                  )}
                  {(item.beforeImageUrl || item.afterImageUrl) && (
                    <View style={styles.portfolioImages}>
                      {item.beforeImageUrl && (
                        <View style={styles.portfolioImageWrap}>
                          <Image source={{ uri: item.beforeImageUrl }} style={styles.portfolioImage} />
                          <Text style={styles.portfolioImageLabel}>Önce</Text>
                        </View>
                      )}
                      {item.afterImageUrl && (
                        <View style={styles.portfolioImageWrap}>
                          <Image source={{ uri: item.afterImageUrl }} style={styles.portfolioImage} />
                          <Text style={styles.portfolioImageLabel}>Sonra</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </SectionCard>
          )}

          <SectionCard title="Değerlendirmeler">
            {profile.reviews.length === 0 ? (
              <Text style={styles.empty}>Henüz değerlendirme yapılmamış.</Text>
            ) : (
              profile.reviews.map((review) => (
                <View key={review.id} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Ionicons
                          key={value}
                          name={value <= review.rating ? "star" : "star-outline"}
                          size={13}
                          color={colors.ctaOrange}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewerName}>{review.reviewerName ?? "Ev sahibi"}</Text>
                  </View>
                  {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
                </View>
              ))
            )}
          </SectionCard>
        </ScrollView>
      )}
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    backButton: { padding: 4, marginRight: 4 },
    container: { padding: 16, gap: 16 },
    message: { marginTop: 32, textAlign: "center", color: colors.inkMuted },
    summaryRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 },
    verifiedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.mist,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    verifiedText: { fontSize: 12, fontWeight: "600", color: colors.turquoise },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingValue: { fontSize: 15, fontWeight: "700", color: colors.ink },
    ratingCount: { fontSize: 12, color: colors.inkMuted },
    about: { fontSize: 14, lineHeight: 21, color: colors.inkMuted },
    empty: { fontSize: 13, color: colors.inkMuted },
    review: { gap: 4, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.mist },
    reviewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    starsRow: { flexDirection: "row", gap: 2 },
    reviewerName: { fontSize: 12, fontWeight: "600", color: colors.ink },
    reviewComment: { fontSize: 13, color: colors.inkMuted },
    portfolioItem: { gap: 6, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.mist },
    portfolioTitle: { fontSize: 13, fontWeight: "600", color: colors.ink },
    portfolioDescription: { fontSize: 12, color: colors.inkMuted },
    portfolioImages: { flexDirection: "row", gap: 8, marginTop: 2 },
    portfolioImageWrap: { alignItems: "center" },
    portfolioImage: { width: 100, height: 100, borderRadius: 10, backgroundColor: colors.mist },
    portfolioImageLabel: { marginTop: 2, fontSize: 10, color: colors.inkMuted },
  });
}
