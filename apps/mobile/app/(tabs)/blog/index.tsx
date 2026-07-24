import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { BlogPostDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";

export default function BlogListScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [posts, setPosts] = useState<BlogPostDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const response = await api.listBlogPosts();
    setPosts(response.posts);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.turquoise} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Henüz yayınlanmış yazı yok.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => router.push(`/(tabs)/blog/${item.slug}`)}>
          {item.coverImageUrl && (
            <Image source={{ uri: item.coverImageUrl }} style={styles.thumb} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardExcerpt} numberOfLines={2}>
              {item.excerpt}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.paper },
    centered: {
      flex: 1,
      backgroundColor: colors.paper,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    message: { textAlign: "center", color: colors.inkMuted, fontSize: 14 },
    list: { padding: 16, gap: 12 },
    card: {
      flexDirection: "row",
      gap: 12,
      borderRadius: 16,
      backgroundColor: colors.mist,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.hairline,
      padding: 12,
      alignItems: "center",
    },
    thumb: { width: 72, height: 72, borderRadius: 12, backgroundColor: colors.paper },
    cardTitle: { fontSize: 15, fontWeight: "700", color: colors.ink },
    cardExcerpt: { marginTop: 4, fontSize: 13, color: colors.inkMuted },
  });
}
