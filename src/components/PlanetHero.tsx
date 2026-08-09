import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { PlanetData } from "../types/planet";

type Props = {
  planet: PlanetData;
};

export default function PlanetHero({ planet }: Props) {
  const scale = useSharedValue(0);
  const float = useSharedValue(0);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 35, stiffness: 100 });

    float.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 2500 }),
        withTiming(4, { duration: 2500 }),
      ),
      -1,
      true
    );
    

    rotate.value = withRepeat(
      withTiming(360, { duration: 25000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: float.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.aura,
          {
            backgroundColor: planet.glowColor,
          },
        ]}
      />

      <View
        style={[
          styles.glow,
          {
            shadowColor: planet.glowColor,
          },
        ]}
      >
        <LinearGradient
          colors={[
            planet.coreColor,
            planet.midColor,
            planet.shadowColor,
          ]}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.planet}
        >
          <View style={styles.highlight} />
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 30,
  },

  planet: {
    width: 170,
    height: 170,
    borderRadius: 85,
  },

  glow: {
    shadowOpacity: 0.9,
    shadowRadius: 35,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 20,
  },
  aura: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.22,
  },
  highlight: {
    position: "absolute",
    top: 28,
    left: 35,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});

