import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useColors } from "@/src/lib/theme-context";
import type { Colors } from "@/src/lib/theme";

export function ListingGallery({ photos }: { photos: string[] }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return <View style={styles.hero} />;
  }

  return (
    <View>
      <Pressable onPress={() => setViewerIndex(0)}>
        <Image source={{ uri: photos[0] }} style={styles.hero} />
      </Pressable>

      {photos.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
        >
          {photos.map((uri, index) => (
            <Pressable key={uri} onPress={() => setViewerIndex(index)}>
              <Image source={{ uri }} style={styles.thumb} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ImageViewing
        images={photos.map((uri) => ({ uri }))}
        imageIndex={viewerIndex ?? 0}
        visible={viewerIndex !== null}
        onRequestClose={() => setViewerIndex(null)}
      />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    hero: { width: "100%", height: 220, borderRadius: 16, backgroundColor: colors.mist },
    thumbRow: { marginTop: 8, gap: 8, paddingBottom: 4 },
    thumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: colors.mist },
  });
}
