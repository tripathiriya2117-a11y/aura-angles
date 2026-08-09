import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { colors } from "../theme/colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import GlassCard from "./ui/GlassCard";
import { CollectionData } from "../types/collection";

type Props = {
  collection: CollectionData;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
};

export default function CollectionCard({
  collection,
  index,
  onPress,
  onLongPress,
}: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 500,
      });

      translateY.value = withTiming(0, {
        duration: 500,
      });
    }, index * 120);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={500}
        style={styles.pressable}
      >
        <GlassCard style={styles.card}>
          <Text style={styles.title}>
            📂 {collection.title}
          </Text>

          <Text style={styles.subtitle}>
            {collection.count} memories
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },

  card: {
    width: "100%",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 6,
    color: colors.textTertiary,
  },

  arrow: {
    color: colors.textPrimary,
    fontSize: 28,
  },
});