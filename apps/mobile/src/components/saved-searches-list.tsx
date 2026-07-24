import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { SavedSearchDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { SectionCard } from "@/src/components/section-card";

function describeSearch(search: SavedSearchDTO) {
  const parts: string[] = [];
  if (search.province) parts.push(search.province);
  if (search.q) parts.push(`"${search.q}"`);
  if (search.maxBuildingAge !== null) parts.push(`en fazla ${search.maxBuildingAge} yaş`);
  if (search.minSquareMeters !== null) parts.push(`en az ${search.minSquareMeters} m²`);
  return parts.length > 0 ? parts.join(" · ") : "Tüm ilanlar";
}

export function SavedSearchesList() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searches, setSearches] = useState<SavedSearchDTO[]>([]);

  const load = useCallback(async () => {
    try {
      const response = await api.listSavedSearches();
      setSearches(response.searches);
    } catch {
      setSearches([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function remove(id: string) {
    setSearches((current) => current.filter((s) => s.id !== id));
    try {
      await api.deleteSavedSearch(id);
    } catch {
      load();
    }
  }

  if (searches.length === 0) return null;

  return (
    <SectionCard title="Kayıtlı Aramalarım">
      {searches.map((search) => (
        <View key={search.id} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{search.name}</Text>
            <Text style={styles.description}>{describeSearch(search)}</Text>
          </View>
          <Pressable onPress={() => remove(search.id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color={colors.ctaRed} />
          </Pressable>
        </View>
      ))}
    </SectionCard>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
    name: { fontSize: 13, fontWeight: "600", color: colors.ink },
    description: { marginTop: 2, fontSize: 12, color: colors.inkMuted },
    deleteButton: { padding: 6 },
  });
}
