import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors } from "@/src/lib/theme-context";
import { useLanguage } from "@/src/lib/i18n-context";
import { LANGUAGE_FLAGS, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from "@/src/lib/i18n";

function LanguagePickerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const { language, setLanguage } = useLanguage();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.paper }]}>
          <FlatList
            data={SUPPORTED_LANGUAGES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.row, { borderBottomColor: colors.hairline }]}
                onPress={() => {
                  setLanguage(item);
                  onClose();
                }}
              >
                <Text style={styles.rowFlag}>{LANGUAGE_FLAGS[item]}</Text>
                <Text style={[styles.rowText, { color: colors.ink }]}>{LANGUAGE_NAMES[item]}</Text>
                {item === language && <Ionicons name="checkmark" size={18} color={colors.turquoise} />}
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function LanguagePickerField() {
  const colors = useColors();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.field, { backgroundColor: colors.mist, borderColor: colors.hairline }]}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="language-outline" size={18} color={colors.inkMuted} />
        <Text style={[styles.fieldValue, { color: colors.ink }]}>{LANGUAGE_NAMES[language]}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.inkMuted} />
      </Pressable>

      <LanguagePickerModal visible={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export function LanguageFlagButton() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.flagButton} onPress={() => setIsOpen(true)}>
        <Text style={styles.flagButtonText}>{LANGUAGE_FLAGS[language]}</Text>
      </Pressable>

      <LanguagePickerModal visible={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  fieldValue: { flex: 1, fontSize: 15 },
  flagButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  flagButtonText: { fontSize: 16 },
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 24, paddingTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  rowFlag: { fontSize: 20 },
  rowText: { flex: 1, fontSize: 15, fontWeight: "500" },
});
