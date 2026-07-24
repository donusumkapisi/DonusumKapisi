import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import {
  createListingSchema,
  validateListingPhotos,
  TURKISH_PROVINCES,
} from "@donusum-kapisi/shared";
import { api, ApiError } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { TextField } from "@/src/components/text-field";
import { Button } from "@/src/components/button";
import { PageHero } from "@/src/components/page-hero";
import { SectionCard } from "@/src/components/section-card";
import { LocationPicker } from "@/src/components/location-picker";

export default function CreateListingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [title, setTitle] = useState("");
  const [province, setProvince] = useState("");
  const [isProvincePickerOpen, setIsProvincePickerOpen] = useState(false);
  const [district, setDistrict] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [buildingAge, setBuildingAge] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user?.role !== "HOMEOWNER") {
    return (
      <View style={styles.container}>
        <PageHero title={t("ilanVer.title")} subtitle={t("ilanVer.subtitle")} compact />
        <View style={styles.centered}>
          <Ionicons name="lock-closed-outline" size={28} color={colors.inkMuted} />
          <Text style={styles.notice}>{t("ilanVer.lockedNotice")}</Text>
        </View>
      </View>
    );
  }

  async function pickPhotos() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(t("ilanVer.photoPermissionError"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets]);
    }
  }

  function removePhoto(uri: string) {
    setPhotos((prev) => prev.filter((photo) => photo.uri !== uri));
  }

  async function submit() {
    setError(null);

    const fields = {
      title,
      province,
      district,
      squareMeters,
      buildingAge,
      floorCount,
      unitCount,
      priceMin,
      priceMax,
      description,
      latitude: latitude !== undefined ? String(latitude) : "",
      longitude: longitude !== undefined ? String(longitude) : "",
    };
    const parsed = createListingSchema.safeParse(fields);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("ilanVer.submitError"));
      return;
    }

    const photoError = validateListingPhotos(
      photos.map((photo) => ({
        type: photo.mimeType ?? "image/jpeg",
        size: photo.fileSize ?? 0,
      }))
    );
    if (photoError) {
      setError(photoError);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(parsed.data)) {
        if (value === undefined) continue;
        formData.append(key, String(value));
      }
      photos.forEach((photo, index) => {
        const extension = photo.mimeType === "image/png" ? "png" : "jpg";
        formData.append(
          "photos",
          {
            uri: photo.uri,
            name: `photo-${index}.${extension}`,
            type: photo.mimeType ?? "image/jpeg",
          } as unknown as Blob
        );
      });

      const response = await api.createListing(formData);
      router.replace(`/(tabs)/ilanlar/${response.listing.listingNumber}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("ilanVer.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <PageHero title={t("ilanVer.title")} subtitle={t("ilanVer.subtitle")} compact />

      <ScrollView contentContainerStyle={styles.form}>
        <SectionCard title={t("ilanVer.sectionBasic")}>
          <TextField label={t("ilanVer.labelTitle")} value={title} onChangeText={setTitle} />

          <View>
            <Text style={styles.label}>{t("ilanVer.labelProvince")}</Text>
            <Pressable style={styles.pickerField} onPress={() => setIsProvincePickerOpen(true)}>
              <Text style={province ? styles.pickerValue : styles.pickerPlaceholder}>
                {province || t("ilanVer.provincePlaceholder")}
              </Text>
            </Pressable>
          </View>

          <TextField label={t("ilanVer.labelDistrict")} value={district} onChangeText={setDistrict} />

          <View>
            <Text style={styles.label}>{t("ilanVer.labelLocation")}</Text>
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </View>
        </SectionCard>

        <SectionCard title={t("ilanVer.sectionBuilding")}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("ilanVer.labelSquareMeters")}
                keyboardType="numeric"
                value={squareMeters}
                onChangeText={setSquareMeters}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("ilanVer.labelBuildingAge")}
                keyboardType="numeric"
                value={buildingAge}
                onChangeText={setBuildingAge}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("ilanVer.labelFloorCount")}
                keyboardType="numeric"
                value={floorCount}
                onChangeText={setFloorCount}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("ilanVer.labelUnitCount")}
                keyboardType="numeric"
                value={unitCount}
                onChangeText={setUnitCount}
              />
            </View>
          </View>
        </SectionCard>

        <SectionCard title={t("ilanVer.sectionPrice")}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("ilanVer.labelPriceMin")}
                keyboardType="numeric"
                value={priceMin}
                onChangeText={setPriceMin}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("ilanVer.labelPriceMax")}
                keyboardType="numeric"
                value={priceMax}
                onChangeText={setPriceMax}
              />
            </View>
          </View>
        </SectionCard>

        <SectionCard title={t("ilanVer.sectionDescription")}>
          <TextField
            label={t("ilanVer.labelDescription")}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </SectionCard>

        <SectionCard title={t("ilanVer.sectionPhotos")}>
          <FlatList
            horizontal
            data={photos}
            keyExtractor={(item) => item.uri}
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={
              <Pressable style={styles.addPhoto} onPress={pickPhotos}>
                <Ionicons name="add" size={20} color={colors.turquoise} />
                <Text style={styles.addPhotoText}>{t("ilanVer.addPhoto")}</Text>
              </Pressable>
            }
            renderItem={({ item }) => (
              <Pressable onLongPress={() => removePhoto(item.uri)}>
                <Image source={{ uri: item.uri }} style={styles.photoThumb} />
              </Pressable>
            )}
          />
        </SectionCard>

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title={t("ilanVer.submit")} onPress={submit} loading={isSubmitting} />
      </ScrollView>

      <Modal visible={isProvincePickerOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={TURKISH_PROVINCES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.modalRow}
                onPress={() => {
                  setProvince(item);
                  setIsProvincePickerOpen(false);
                }}
              >
                <Text style={styles.modalRowText}>{item}</Text>
              </Pressable>
            )}
          />
          <Button title={t("ilanVer.close")} variant="outline" onPress={() => setIsProvincePickerOpen(false)} />
        </View>
      </Modal>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.paper },
    form: { padding: 20, gap: 16, paddingBottom: 40 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
    notice: { fontSize: 14, color: colors.inkMuted, textAlign: "center" },
    row: { flexDirection: "row", gap: 12 },
    label: { fontSize: 13, fontWeight: "500", color: colors.inkMuted, marginBottom: 6 },
    pickerField: {
      height: 46,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.mist,
      paddingHorizontal: 14,
      justifyContent: "center",
    },
    pickerValue: { fontSize: 15, color: colors.ink },
    pickerPlaceholder: { fontSize: 15, color: colors.inkMuted },
    addPhoto: {
      width: 72,
      height: 72,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.hairline,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
    },
    addPhotoText: { fontSize: 11, color: colors.turquoise, fontWeight: "600", marginTop: 2 },
    photoThumb: { width: 72, height: 72, borderRadius: 10 },
    error: { fontSize: 13, color: colors.ctaRed },
    modalContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 12, backgroundColor: colors.paper },
    modalRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.hairline },
    modalRowText: { fontSize: 15, color: colors.ink },
  });
}
