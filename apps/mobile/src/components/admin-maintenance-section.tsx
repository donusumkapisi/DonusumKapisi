import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { api } from "@/src/lib/api";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";

export function AdminMaintenanceSection() {
  const { t } = useTranslation();
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const status = await api.getMaintenanceStatus();
      setEnabled(Boolean(status.maintenanceMode));
      setMessage(status.message);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle() {
    setSaving(true);
    try {
      const next = !enabled;
      const status = await api.setMaintenanceMode(next, message);
      setEnabled(Boolean(status.maintenanceMode));
      setMessage(status.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <ActivityIndicator color={colors.turquoise} style={{ marginVertical: 8 }} />;
  }

  return (
    <View style={[styles.card, { borderColor: colors.hairline, backgroundColor: colors.paper }]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.ctaOrange}18` }]}>
          <Ionicons name="construct-outline" size={18} color={colors.ctaOrange} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.ink }]}>{t("panel.maintenanceTitle")}</Text>
          <Text style={[styles.subtitle, { color: colors.inkMuted }]}>
            {enabled ? t("panel.maintenanceOn") : t("panel.maintenanceOff")}
          </Text>
        </View>
      </View>
      <Button
        title={enabled ? t("panel.maintenanceTurnOff") : t("panel.maintenanceTurnOn")}
        size="sm"
        variant={enabled ? "outline" : "primary"}
        loading={saving}
        icon={enabled ? "checkmark-circle-outline" : "pause-circle-outline"}
        onPress={toggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "600" },
  subtitle: { marginTop: 2, fontSize: 12 },
});
