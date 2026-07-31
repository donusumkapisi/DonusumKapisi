import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { TURKISH_PROVINCES, getDistrictsForProvince } from "@donusum-kapisi/shared";
import { ApiError, api } from "@/src/lib/api";
import { useLanguage } from "@/src/lib/i18n-context";
import { formatPrice, formatPriceRange, type Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";

type EstimateResult = {
  priceMin: number;
  priceMax: number;
  averagePrice: number;
  explanation: string;
  sourceNote: string;
};

type PickerKind = "province" | "district" | null;

function FieldLabel({ label, colors }: { label: string; colors: Colors }) {
  return <Text style={[styles.label, { color: colors.inkMuted }]}>{label}</Text>;
}

function SelectField({
  value,
  placeholder,
  onPress,
  disabled,
  colors,
}: {
  value: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  colors: Colors;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.field,
        { backgroundColor: colors.mist, borderColor: colors.hairline, opacity: disabled ? 0.45 : 1 },
      ]}
    >
      <Text style={[styles.fieldText, { color: value ? colors.ink : colors.inkMuted }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={16} color={colors.inkMuted} />
    </Pressable>
  );
}

function NumberField({
  value,
  onChangeText,
  placeholder,
  colors,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  colors: Colors;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.inkMuted}
      keyboardType="number-pad"
      style={[
        styles.field,
        styles.input,
        { backgroundColor: colors.mist, borderColor: colors.hairline, color: colors.ink },
      ]}
    />
  );
}

export function AiPriceEstimateModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [buildingAge, setBuildingAge] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [picker, setPicker] = useState<PickerKind>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const districts = useMemo(() => getDistrictsForProvince(province), [province]);

  function resetResult() {
    setResult(null);
    setError(null);
  }

  function sourceNoteFor(
    source: "openai" | "local",
    failure: "missing_key" | "quota" | "auth" | "other" | null
  ) {
    if (source === "openai") return t("priceEstimate.sourceOpenAI");
    if (failure === "quota") return t("priceEstimate.sourceQuota");
    if (failure === "auth") return t("priceEstimate.sourceAuth");
    if (failure === "missing_key") return t("priceEstimate.sourceMissingKey");
    return t("priceEstimate.sourceLocal");
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.estimatePrice({
        province,
        district,
        squareMeters: Number(squareMeters),
        unitCount: Number(unitCount),
        buildingAge: Number(buildingAge),
        floorCount: Number(floorCount),
        locale: language,
      });

      const explanation =
        data.explanation ??
        t("priceEstimate.explanation", {
          province,
          district,
          m2: squareMeters,
          units: unitCount,
          age: buildingAge,
          floors: floorCount,
        });

      setResult({
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        averagePrice: data.averagePrice,
        explanation,
        sourceNote: sourceNoteFor(data.source, data.openAIFailure),
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : t("priceEstimate.errorFailed");
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const pickerData =
    picker === "province" ? [...TURKISH_PROVINCES] : picker === "district" ? [...districts] : [];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.screen, { backgroundColor: colors.paper, paddingTop: insets.top }]}>
        <View style={[styles.header, { borderBottomColor: colors.hairline }]}>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.eyebrow, { color: colors.turquoise }]}>
              {t("priceEstimate.eyebrow")}
            </Text>
            <Text style={[styles.title, { color: colors.ink }]}>{t("priceEstimate.title")}</Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
          >
            <Ionicons name="close" size={24} color={colors.ink} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.subtitle, { color: colors.inkMuted }]}>
              {t("priceEstimate.subtitle")}
            </Text>

            <FieldLabel label={t("priceEstimate.provinceLabel")} colors={colors} />
            <SelectField
              value={province}
              placeholder={t("priceEstimate.provincePlaceholder")}
              colors={colors}
              onPress={() => setPicker("province")}
            />

            <FieldLabel label={t("priceEstimate.districtLabel")} colors={colors} />
            <SelectField
              value={district}
              placeholder={t("priceEstimate.districtPlaceholder")}
              colors={colors}
              disabled={!province}
              onPress={() => setPicker("district")}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <FieldLabel label={t("priceEstimate.squareMetersLabel")} colors={colors} />
                <NumberField
                  value={squareMeters}
                  onChangeText={(v) => {
                    setSquareMeters(v.replace(/[^0-9]/g, ""));
                    resetResult();
                  }}
                  placeholder="1200"
                  colors={colors}
                />
              </View>
              <View style={styles.col}>
                <FieldLabel label={t("priceEstimate.unitCountLabel")} colors={colors} />
                <NumberField
                  value={unitCount}
                  onChangeText={(v) => {
                    setUnitCount(v.replace(/[^0-9]/g, ""));
                    resetResult();
                  }}
                  placeholder="8"
                  colors={colors}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <FieldLabel label={t("priceEstimate.buildingAgeLabel")} colors={colors} />
                <NumberField
                  value={buildingAge}
                  onChangeText={(v) => {
                    setBuildingAge(v.replace(/[^0-9]/g, ""));
                    resetResult();
                  }}
                  placeholder="35"
                  colors={colors}
                />
              </View>
              <View style={styles.col}>
                <FieldLabel label={t("priceEstimate.floorCountLabel")} colors={colors} />
                <NumberField
                  value={floorCount}
                  onChangeText={(v) => {
                    setFloorCount(v.replace(/[^0-9]/g, ""));
                    resetResult();
                  }}
                  placeholder="5"
                  colors={colors}
                />
              </View>
            </View>

            <Button
              title={loading ? t("priceEstimate.submitPending") : t("priceEstimate.submit")}
              icon="sparkles"
              loading={loading}
              onPress={handleSubmit}
              style={styles.submit}
            />

            {error ? (
              <Text style={[styles.error, { color: colors.ctaRed }]}>{error}</Text>
            ) : null}

            {loading ? (
              <View style={[styles.resultCard, { backgroundColor: colors.deep }]}>
                <ActivityIndicator color={colors.turquoise} />
                <Text style={styles.resultPending}>{t("priceEstimate.submitPending")}</Text>
              </View>
            ) : result ? (
              <View style={[styles.resultCard, { backgroundColor: colors.deep }]}>
                <Text style={styles.resultEyebrow}>{t("priceEstimate.resultEyebrow")}</Text>
                <Text style={styles.resultPrice}>{formatPrice(result.averagePrice)}</Text>
                <Text style={styles.resultRange}>
                  {t("priceEstimate.resultRange", {
                    range: formatPriceRange(result.priceMin, result.priceMax),
                  })}
                </Text>
                <Text style={styles.resultExplanation}>{result.explanation}</Text>
                <Text style={styles.resultSource}>{result.sourceNote}</Text>
              </View>
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.mist }]}>
                <Text style={[styles.emptyTitle, { color: colors.ink }]}>
                  {t("priceEstimate.visualEmptyTitle")}
                </Text>
                <Text style={[styles.emptyBody, { color: colors.inkMuted }]}>
                  {t("priceEstimate.visualEmptyBody")}
                </Text>
              </View>
            )}

            <Text style={[styles.disclaimer, { color: colors.inkMuted }]}>
              {t("priceEstimate.disclaimer")}
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {picker !== null ? (
        <View style={[styles.pickerOverlay, { paddingTop: insets.top }]}>
          <Pressable style={styles.pickerBackdropFill} onPress={() => setPicker(null)} />
          <View style={[styles.pickerSheet, { backgroundColor: colors.paper, paddingBottom: insets.bottom }]}>
            <Text style={[styles.pickerTitle, { color: colors.ink }]}>
              {picker === "province"
                ? t("priceEstimate.provincePlaceholder")
                : t("priceEstimate.districtPlaceholder")}
            </Text>
            <ScrollView style={styles.pickerList}>
              {pickerData.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.pickerRow, { borderBottomColor: colors.hairline }]}
                  onPress={() => {
                    if (picker === "province") {
                      setProvince(item);
                      setDistrict("");
                    } else {
                      setDistrict(item);
                    }
                    resetResult();
                    setPicker(null);
                  }}
                >
                  <Text style={[styles.pickerRowText, { color: colors.ink }]}>{item}</Text>
                  {((picker === "province" && province === item) ||
                    (picker === "district" && district === item)) && (
                    <Ionicons name="checkmark" size={18} color={colors.turquoise} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <Button
              title={t("common.close")}
              variant="outline"
              onPress={() => setPicker(null)}
              style={{ margin: 16 }}
            />
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTextWrap: { flex: 1, gap: 4 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: { fontSize: 20, fontWeight: "700", lineHeight: 26 },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  label: { fontSize: 12, fontWeight: "600", marginTop: 8, marginBottom: 4 },
  field: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fieldText: { flex: 1, fontSize: 15 },
  input: { paddingVertical: 0 },
  row: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  submit: { marginTop: 16 },
  error: { marginTop: 10, fontSize: 13, fontWeight: "600" },
  resultCard: {
    marginTop: 18,
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  resultPending: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 10 },
  resultEyebrow: {
    color: "#3fcbbd",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  resultPrice: { color: "#fff", fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  resultRange: { color: "rgba(255,255,255,0.55)", fontSize: 13 },
  resultExplanation: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 20, marginTop: 8 },
  resultSource: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 6,
  },
  emptyCard: { marginTop: 18, borderRadius: 18, padding: 18, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "700", lineHeight: 22 },
  emptyBody: { fontSize: 13, lineHeight: 19 },
  disclaimer: { marginTop: 14, fontSize: 12, lineHeight: 17 },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerBackdropFill: { ...StyleSheet.absoluteFillObject },
  pickerSheet: {
    maxHeight: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  pickerList: { maxHeight: 360 },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerRowText: { fontSize: 15 },
});
