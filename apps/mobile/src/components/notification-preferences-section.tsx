import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { NotificationPreferencesDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { SectionCard } from "@/src/components/section-card";

const OPTIONS: { key: keyof NotificationPreferencesDTO; labelKey: string }[] = [
  { key: "notifyListingStatus", labelKey: "notifications.listingStatus" },
  { key: "notifyOffers", labelKey: "notifications.offers" },
  { key: "notifyAppointments", labelKey: "notifications.appointments" },
  { key: "notifySavedSearch", labelKey: "notifications.savedSearch" },
];

export function NotificationPreferencesSection() {
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [preferences, setPreferences] = useState<NotificationPreferencesDTO | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await api.getNotificationPreferences();
      setPreferences(response.preferences);
    } catch {
      setPreferences(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function toggle(key: keyof NotificationPreferencesDTO, value: boolean) {
    if (!preferences) return;
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    try {
      await api.updateNotificationPreferences(next);
    } catch {
      load();
    }
  }

  if (!preferences) return null;

  return (
    <SectionCard title={t("notifications.title")}>
      {OPTIONS.map((option) => (
        <View key={option.key} style={styles.row}>
          <Text style={styles.label}>{t(option.labelKey)}</Text>
          <Switch
            value={preferences[option.key]}
            onValueChange={(value) => toggle(option.key, value)}
            trackColor={{ true: colors.turquoise }}
          />
        </View>
      ))}
    </SectionCard>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
    label: { flex: 1, fontSize: 13, color: colors.ink, marginRight: 8 },
  });
}
