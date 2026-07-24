import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { AppointmentDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import { downloadAndShareAppointmentIcs } from "@/src/lib/ics";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { StatusBadge, type StatusTone } from "@/src/components/status-badge";

const STATUS_LABELS: Record<AppointmentDTO["status"], { label: string; tone: StatusTone }> = {
  PROPOSED: { label: "Onay Bekliyor", tone: "warning" },
  CONFIRMED: { label: "Onaylandı", tone: "positive" },
  CANCELLED: { label: "İptal Edildi", tone: "neutral" },
};

export function AppointmentCard({
  appointment,
  onUpdated,
}: {
  appointment: AppointmentDTO;
  onUpdated: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const status = STATUS_LABELS[appointment.status];
  const formatted = new Date(appointment.scheduledAt).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  async function respond(next: "CONFIRMED" | "CANCELLED") {
    setIsSubmitting(true);
    try {
      await api.updateAppointmentStatus(appointment.id, next);
      onUpdated();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function addToCalendar() {
    setIsAddingToCalendar(true);
    try {
      await downloadAndShareAppointmentIcs(appointment.id);
    } catch {
      // Kullanıcı paylaşımı iptal etmiş veya indirme başarısız olmuş olabilir; sessizce yut.
    } finally {
      setIsAddingToCalendar(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={16} color={colors.turquoise} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            Keşif randevusu: {formatted}
            {appointment.location ? ` · ${appointment.location}` : ""}
          </Text>
          <StatusBadge label={status.label} tone={status.tone} />
        </View>
      </View>
      <View style={styles.actions}>
        {appointment.status !== "CANCELLED" && (
          <Button
            title="Takvime Ekle"
            size="sm"
            variant="outline"
            icon="calendar-outline"
            loading={isAddingToCalendar}
            onPress={addToCalendar}
          />
        )}
        {appointment.status === "PROPOSED" && (
          <>
            <Button
              title="Onayla"
              size="sm"
              loading={isSubmitting}
              onPress={() => respond("CONFIRMED")}
            />
            <Button
              title="İptal Et"
              size="sm"
              variant="outline"
              loading={isSubmitting}
              onPress={() => respond("CANCELLED")}
            />
          </>
        )}
      </View>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { marginTop: 8, gap: 8, backgroundColor: colors.mist, borderRadius: 12, padding: 10 },
    row: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
    title: { fontSize: 12, fontWeight: "600", color: colors.ink, marginBottom: 4 },
    actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  });
}
