import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import type { PortfolioItemDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { SectionCard } from "@/src/components/section-card";
import { TextField } from "@/src/components/text-field";
import { Button } from "@/src/components/button";

export function PortfolioManager() {
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState<PortfolioItemDTO[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeImage, setBeforeImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [afterImage, setAfterImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await api.listPortfolioItems();
      setItems(response.items);
    } catch {
      setItems([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function pickImage(setter: (asset: ImagePicker.ImagePickerAsset) => void) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0]);
    }
  }

  async function submit() {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (description.trim()) formData.append("description", description.trim());
      if (beforeImage) {
        formData.append("beforeImage", {
          uri: beforeImage.uri,
          name: "before.jpg",
          type: beforeImage.mimeType ?? "image/jpeg",
        } as unknown as Blob);
      }
      if (afterImage) {
        formData.append("afterImage", {
          uri: afterImage.uri,
          name: "after.jpg",
          type: afterImage.mimeType ?? "image/jpeg",
        } as unknown as Blob);
      }

      await api.createPortfolioItem(formData);
      setTitle("");
      setDescription("");
      setBeforeImage(null);
      setAfterImage(null);
      load();
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    try {
      await api.deletePortfolioItem(id);
    } catch {
      load();
    }
  }

  return (
    <SectionCard title={t("portfolio.title")}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.thumbRow}>
            {item.beforeImageUrl && <Image source={{ uri: item.beforeImageUrl }} style={styles.thumb} />}
            {item.afterImageUrl && <Image source={{ uri: item.afterImageUrl }} style={styles.thumb} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <Pressable onPress={() => remove(item.id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color={colors.ctaRed} />
          </Pressable>
        </View>
      ))}

      <View style={styles.form}>
        <TextField label={t("portfolio.projectTitleLabel")} value={title} onChangeText={setTitle} />
        <TextField
          label={t("portfolio.descriptionLabel")}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.pickRow}>
          <Pressable style={styles.pickButton} onPress={() => pickImage(setBeforeImage)}>
            {beforeImage ? (
              <Image source={{ uri: beforeImage.uri }} style={styles.pickPreview} />
            ) : (
              <>
                <Ionicons name="image-outline" size={18} color={colors.turquoise} />
                <Text style={styles.pickButtonText}>{t("portfolio.beforePhoto")}</Text>
              </>
            )}
          </Pressable>
          <Pressable style={styles.pickButton} onPress={() => pickImage(setAfterImage)}>
            {afterImage ? (
              <Image source={{ uri: afterImage.uri }} style={styles.pickPreview} />
            ) : (
              <>
                <Ionicons name="image-outline" size={18} color={colors.turquoise} />
                <Text style={styles.pickButtonText}>{t("portfolio.afterPhoto")}</Text>
              </>
            )}
          </Pressable>
        </View>

        <Button
          title={t("portfolio.addProject")}
          size="sm"
          icon="add"
          loading={isSaving}
          onPress={submit}
        />
      </View>
    </SectionCard>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
    thumbRow: { flexDirection: "row", gap: 4 },
    thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: colors.mist },
    itemTitle: { fontSize: 13, fontWeight: "600", color: colors.ink },
    itemDescription: { marginTop: 2, fontSize: 12, color: colors.inkMuted },
    deleteButton: { padding: 6 },
    form: { gap: 10, marginTop: 8, borderTopWidth: 1, borderTopColor: colors.mist, paddingTop: 12 },
    pickRow: { flexDirection: "row", gap: 10 },
    pickButton: {
      flex: 1,
      height: 72,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.mist,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      overflow: "hidden",
    },
    pickButtonText: { fontSize: 12, color: colors.turquoise, fontWeight: "600" },
    pickPreview: { width: "100%", height: "100%" },
  });
}
