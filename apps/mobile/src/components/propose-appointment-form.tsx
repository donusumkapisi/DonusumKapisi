import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { TextField } from "@/src/components/text-field";

export function ProposeAppointmentForm({ offerId, onProposed }: { offerId: string; onProposed: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!date || !time) {
      setError("Tarih ve saat girin (örn. 2026-08-15, 14:30).");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await api.proposeAppointment(offerId, {
        scheduledAt: new Date(`${date}T${time}`),
        location: location || undefined,
      });
      setIsOpen(false);
      setDate("");
      setTime("");
      setLocation("");
      onProposed();
    } catch {
      setError("Randevu planlanamadı. Tarih/saat biçimini kontrol edin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        title="Randevu Planla"
        size="sm"
        variant="outline"
        icon="calendar-outline"
        onPress={() => setIsOpen(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <TextField label="Tarih (YYYY-AA-GG)" value={date} onChangeText={setDate} placeholder="2026-08-15" />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label="Saat (SS:DD)" value={time} onChangeText={setTime} placeholder="14:30" />
        </View>
      </View>
      <TextField label="Konum (opsiyonel)" value={location} onChangeText={setLocation} />
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.row}>
        <Button title="Gönder" size="sm" loading={isSubmitting} onPress={submit} />
        <Button title="Vazgeç" size="sm" variant="outline" onPress={() => setIsOpen(false)} />
      </View>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { marginTop: 8, gap: 8, backgroundColor: colors.mist, borderRadius: 12, padding: 10 },
    row: { flexDirection: "row", gap: 8 },
    error: { fontSize: 12, color: colors.ctaRed },
  });
}
