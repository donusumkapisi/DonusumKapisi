import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import type { BlogPostDTO } from "@donusum-kapisi/shared";
import { api } from "@/src/lib/api";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [post, setPost] = useState<BlogPostDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getBlogPost(slug);
      setPost(response.post);
    } catch {
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

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

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Yazı bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.excerpt}>{post.excerpt}</Text>

      {post.coverImageUrl && <Image source={{ uri: post.coverImageUrl }} style={styles.cover} />}

      <Text style={styles.body}>{post.body}</Text>
    </ScrollView>
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
    container: { padding: 16, paddingBottom: 32, backgroundColor: colors.paper },
    message: { textAlign: "center", color: colors.inkMuted },
    title: { fontSize: 22, fontWeight: "800", color: colors.ink },
    excerpt: { marginTop: 6, fontSize: 13, color: colors.inkMuted },
    cover: { width: "100%", height: 200, borderRadius: 16, backgroundColor: colors.mist, marginTop: 16 },
    body: { marginTop: 16, fontSize: 14, lineHeight: 21, color: colors.ink },
  });
}
