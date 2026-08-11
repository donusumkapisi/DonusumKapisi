import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";

type Announcement = {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  linkUrl: string | null;
};

const storageKey = (id: string) => `dk-announcement-dismissed:${id}`;

export function SiteAnnouncementModal() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await api.getLatestAnnouncement();
        const next = response.announcement;
        if (!next || cancelled) return;
        const dismissed = await SecureStore.getItemAsync(storageKey(next.id));
        if (dismissed) return;
        setAnnouncement(next);
        setVisible(true);
      } catch {
        // Announcement is non-critical; ignore network failures.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function dismiss() {
    if (announcement) {
      try {
        await SecureStore.setItemAsync(storageKey(announcement.id), "1");
      } catch {
        // ignore
      }
    }
    setVisible(false);
  }

  if (!announcement) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={[styles.backdrop, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel={t("announcement.dismiss")} />
        <View style={styles.card}>
          <View style={styles.accent} />
          <Pressable style={styles.closeBtn} onPress={dismiss} accessibilityLabel={t("announcement.dismiss")}>
            <Ionicons name="close" size={18} color={colors.inkMuted} />
          </Pressable>

          {announcement.imageUrl ? (
            <Image source={{ uri: announcement.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : null}

          <ScrollView contentContainerStyle={styles.body} bounces={false}>
            <View style={styles.eyebrowRow}>
              <View style={styles.iconWrap}>
                <Ionicons name="megaphone-outline" size={14} color={colors.turquoise} />
              </View>
              <Text style={styles.eyebrow}>{t("announcement.eyebrow")}</Text>
            </View>
            <Text style={styles.title}>{announcement.title}</Text>
            <Text style={styles.text}>{announcement.body}</Text>

            <View style={styles.actions}>
              {announcement.linkUrl ? (
                <Button
                  title={t("announcement.openLink")}
                  onPress={() => Linking.openURL(announcement.linkUrl!)}
                />
              ) : null}
              <Button
                title={t("announcement.close")}
                variant={announcement.linkUrl ? "outline" : "primary"}
                onPress={dismiss}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(7, 22, 32, 0.72)",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    card: {
      maxHeight: "88%",
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: colors.paper,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    accent: { height: 4, backgroundColor: colors.turquoise },
    closeBtn: {
      position: "absolute",
      top: 12,
      right: 12,
      zIndex: 2,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.paper,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    image: { width: "100%", height: 160, backgroundColor: colors.mist },
    body: { padding: 20, gap: 10, paddingBottom: 24 },
    eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.turquoise}22`,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: colors.turquoise,
    },
    title: { fontSize: 22, fontWeight: "600", color: colors.ink, lineHeight: 28 },
    text: { fontSize: 14, lineHeight: 21, color: colors.inkMuted },
    actions: { marginTop: 10, gap: 8 },
  });
}
