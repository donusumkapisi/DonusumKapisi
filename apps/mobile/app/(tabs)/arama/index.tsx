import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { TURKISH_PROVINCES, type ListingDTO } from "@donusum-kapisi/shared";
import { api, ApiError } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { ListingCard } from "@/src/components/listing-card";
import { PageHero } from "@/src/components/page-hero";
import { SearchField } from "@/src/components/search-field";

const POPULAR_PROVINCES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Kocaeli", "Antalya"];

export default function AramaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const colors = useColors();
  const styles = useStyles();
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [isProvincePickerOpen, setIsProvincePickerOpen] = useState(false);
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [isSavingSearch, setIsSavingSearch] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const allProvincesLabel = t("arama.allProvinces");

  async function saveSearch() {
    if (!searchName.trim()) return;
    setIsSavingSearch(true);
    setSaveMessage(null);
    try {
      await api.createSavedSearch({ name: searchName.trim(), province, q: query });
      setSaveMessage(t("arama.saveSearchSuccess"));
      setSearchName("");
    } catch (err) {
      setSaveMessage(err instanceof ApiError ? err.message : t("arama.saveSearchError"));
    } finally {
      setIsSavingSearch(false);
    }
  }

  async function search(overrides?: { q?: string; il?: string }) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.listListings({
        q: overrides?.q ?? query,
        il: overrides?.il ?? province,
      });
      setListings(response.listings);
    } catch {
      setError(t("arama.searchError"));
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }

  function selectCity(city: string) {
    setProvince(city);
    search({ il: city });
  }

  function clearFilters() {
    setQuery("");
    setProvince("");
    search({ q: "", il: "" });
  }

  return (
    <View style={styles.container}>
      <PageHero title={t("arama.title")} subtitle={t("arama.subtitle")} compact />

      <View style={styles.filters}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={t("arama.searchPlaceholder")}
          onSubmitEditing={() => search()}
          returnKeyType="search"
        />

        <Pressable style={styles.provinceField} onPress={() => setIsProvincePickerOpen(true)}>
          <Ionicons name="location-outline" size={18} color={colors.inkMuted} />
          <Text style={province ? styles.provinceValue : styles.provincePlaceholder}>
            {province || allProvincesLabel}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.inkMuted} />
        </Pressable>

        <Button title={t("arama.searchButton")} onPress={() => search()} loading={isLoading} />
      </View>

      {hasSearched && user && !isLoading && (
        <View style={styles.saveSearchRow}>
          <SearchField
            value={searchName}
            onChangeText={setSearchName}
            placeholder={t("arama.saveSearchPlaceholder")}
          />
          <Button
            title={t("arama.save")}
            size="sm"
            variant="outline"
            icon="bookmark-outline"
            loading={isSavingSearch}
            onPress={saveSearch}
          />
        </View>
      )}
      {saveMessage && <Text style={styles.saveMessage}>{saveMessage}</Text>}

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={colors.turquoise} />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : !hasSearched ? (
        <EmptyState
          icon="search-outline"
          title={t("arama.emptyBeforeTitle")}
          subtitle={t("arama.emptyBeforeSubtitle")}
        >
          <View style={styles.popularSection}>
            <Text style={styles.popularLabel}>{t("arama.popularCitiesLabel")}</Text>
            <View style={styles.chipWrap}>
              {POPULAR_PROVINCES.map((city) => (
                <Pressable key={city} style={styles.cityChip} onPress={() => selectCity(city)}>
                  <Ionicons name="location-outline" size={13} color={colors.ink} />
                  <Text style={styles.cityChipText}>{city}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </EmptyState>
      ) : listings.length === 0 ? (
        <EmptyState
          icon="file-tray-outline"
          title={t("arama.noResultsTitle")}
          subtitle={t("arama.noResultsSubtitle")}
        >
          {(query || province) && (
            <Button
              title={t("arama.clearFilters")}
              size="sm"
              variant="outline"
              icon="refresh-outline"
              onPress={clearFilters}
            />
          )}
        </EmptyState>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>{t("arama.resultsCount", { count: listings.length })}</Text>
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => router.push(`/(tabs)/ilanlar/${item.listingNumber}`)}
            />
          )}
        />
      )}

      <Modal visible={isProvincePickerOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={[allProvincesLabel, ...TURKISH_PROVINCES]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.modalRow}
                onPress={() => {
                  setProvince(item === allProvincesLabel ? "" : item);
                  setIsProvincePickerOpen(false);
                }}
              >
                <Text style={styles.modalRowText}>{item}</Text>
              </Pressable>
            )}
          />
          <Button title={t("arama.close")} variant="outline" onPress={() => setIsProvincePickerOpen(false)} />
        </View>
      </Modal>
    </View>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name={icon} size={26} color={colors.ink} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

function useStyles() {
  const colors = useColors();
  return useMemo(() => createStyles(colors), [colors]);
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  filters: { marginTop: -12, paddingHorizontal: 20, gap: 10 },
  provinceField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.mist,
    paddingHorizontal: 16,
  },
  saveSearchRow: { marginTop: 4, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 8 },
  saveMessage: { marginTop: 6, paddingHorizontal: 20, fontSize: 12, color: colors.turquoise },
  provinceValue: { flex: 1, fontSize: 15, color: colors.ink },
  provincePlaceholder: { flex: 1, fontSize: 15, color: colors.inkMuted },
  message: { textAlign: "center", color: colors.inkMuted, fontSize: 14 },
  empty: { marginTop: 36, alignItems: "center", gap: 8, paddingHorizontal: 32 },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: colors.ink },
  emptySubtitle: { fontSize: 13, color: colors.inkMuted, textAlign: "center", lineHeight: 19 },
  popularSection: { marginTop: 28, width: "100%", alignItems: "center", gap: 12 },
  popularLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.inkMuted,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  cityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cityChipText: { fontSize: 13, fontWeight: "500", color: colors.ink },
  list: { gap: 12, padding: 20, paddingTop: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: colors.inkMuted, marginBottom: 4 },
  modalContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 12, backgroundColor: colors.paper },
  modalRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.hairline },
  modalRowText: { fontSize: 15, color: colors.ink },
  });
}
