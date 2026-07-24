import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import type { ListingDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { ListingCard } from "@/src/components/listing-card";
import { ListingsMap } from "@/src/components/listings-map";
import { SearchField } from "@/src/components/search-field";
import { LanguageFlagButton } from "@/src/components/language-picker";

const CATEGORIES = [
  { key: "all", labelKey: "vitrin.categoryAll", minAge: 0 },
  { key: "20", labelKey: "vitrin.category20", minAge: 20 },
  { key: "30", labelKey: "vitrin.category30", minAge: 30 },
  { key: "40", labelKey: "vitrin.category40", minAge: 40 },
] as const;

export default function ListingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["key"]>("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (q?: string, minYas?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.listListings({
        q,
        minYas: minYas && minYas > 0 ? String(minYas) : undefined,
      });
      setListings(response.listings);
    } catch {
      setError(t("vitrin.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      const active = CATEGORIES.find((item) => item.key === category) ?? CATEGORIES[0];
      load(query, active.minAge);
    }, [load, category, query])
  );

  const featuredListing = listings[0];
  const gridListings = listings.slice(1);

  function openListing(listing: ListingDTO) {
    router.push(`/(tabs)/ilanlar/${listing.listingNumber}`);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
        <View style={styles.heroTop}>
          <Text style={styles.eyebrow}>{t("vitrin.eyebrow")}</Text>
          <View style={styles.heroActions}>
            <LanguageFlagButton />
            <Pressable
              style={styles.viewToggle}
              onPress={() => setView((v) => (v === "list" ? "map" : "list"))}
            >
              <Ionicons
                name={view === "list" ? "map-outline" : "list-outline"}
                size={18}
                color={colors.onDark}
              />
            </Pressable>
          </View>
        </View>
        <Text style={styles.heroTitle}>{t("vitrin.heroTitle")}</Text>
        <Text style={styles.heroSubtitle}>
          {isLoading
            ? t("vitrin.heroSubtitleLoading")
            : t("vitrin.heroSubtitle", { count: listings.length })}
        </Text>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("vitrin.searchPlaceholder")}
        onSubmitEditing={() => {
          const active = CATEGORIES.find((item) => item.key === category) ?? CATEGORIES[0];
          load(query, active.minAge);
        }}
        returnKeyType="search"
        containerStyle={styles.searchCard}
      />

      <View style={styles.tabsRow}>
        {CATEGORIES.map((item) => {
          const active = item.key === category;
          return (
            <Pressable
              key={item.key}
              style={[styles.tabItem, active && styles.tabItemActive]}
              onPress={() => setCategory(item.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t(item.labelKey)}</Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={colors.turquoise} />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : listings.length === 0 ? (
        <Text style={styles.message}>{t("vitrin.noResults")}</Text>
      ) : view === "map" ? (
        <View style={{ flex: 1 }}>
          <ListingsMap listings={listings} onSelect={openListing} />
        </View>
      ) : (
        <FlatList
          data={gridListings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.headerSections}>
              {featuredListing && (
                <View style={styles.featuredSection}>
                  <Text style={styles.sectionLabel}>{t("vitrin.featuredLabel")}</Text>
                  <ListingCard
                    listing={featuredListing}
                    variant="featured"
                    onPress={() => openListing(featuredListing)}
                  />
                </View>
              )}
              <Text style={styles.sectionLabel}>
                {t("vitrin.allListingsLabel", { count: listings.length })}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ListingCard listing={item} variant="grid" onPress={() => openListing(item)} />
          )}
        />
      )}
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.paper },
    hero: {
      backgroundColor: colors.deep,
      paddingHorizontal: 24,
      paddingBottom: 34,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    heroActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    eyebrow: {
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 2,
      color: colors.turquoiseSoft,
    },
    viewToggle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.14)",
    },
    heroTitle: {
      marginTop: 14,
      fontSize: 25,
      lineHeight: 32,
      fontWeight: "500",
      color: colors.onDark,
    },
    heroSubtitle: { marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.65)" },
    searchCard: { marginTop: -22, marginHorizontal: 20 },
    tabsRow: {
      flexDirection: "row",
      gap: 22,
      paddingHorizontal: 20,
      marginTop: 22,
      borderBottomWidth: 1,
      borderBottomColor: colors.hairline,
    },
    tabItem: { paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: "transparent" },
    tabItemActive: { borderBottomColor: colors.ink },
    tabText: { fontSize: 13.5, fontWeight: "500", color: colors.inkMuted },
    tabTextActive: { color: colors.ink, fontWeight: "600" },
    message: { marginTop: 32, textAlign: "center", color: colors.inkMuted, fontSize: 14 },
    headerSections: { gap: 20, marginBottom: 14 },
    featuredSection: { gap: 10 },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: colors.inkMuted,
    },
    list: { gap: 12, padding: 20, paddingTop: 18 },
    gridRow: { gap: 12 },
  });
}
