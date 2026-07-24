import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";

const logo = require("../assets/logo.png");

export default function Index() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [introFinished, setIntroFinished] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
    scale.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
      withRepeat(
        withTiming(1.08, { duration: 450, easing: Easing.inOut(Easing.quad) }),
        2,
        true,
        (finished) => {
          if (finished) runOnJS(setIntroFinished)(true);
        },
      ),
    );
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (introFinished) {
    return <Redirect href="/ilanlar" />;
  }

  return (
    <View style={styles.container}>
      <Animated.Image source={logo} style={[styles.logo, animatedStyle]} resizeMode="contain" />
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.paper,
    },
    logo: {
      width: 240,
      height: 240,
    },
  });
}
