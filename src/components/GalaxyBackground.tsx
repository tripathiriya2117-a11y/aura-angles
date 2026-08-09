import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface GalaxyBackgroundProps {
  width: number;
  height: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  twinkleTone: boolean;
}

function generateStars(width: number, height: number, count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.3,
      o: Math.random() * 0.6 + 0.25,
      twinkleTone: Math.random() > 0.85,
    });
  }
  return stars;
}

export function GalaxyBackground({ width, height }: GalaxyBackgroundProps) {
  const stars = useMemo(() => generateStars(width, height, 80), [width, height]);
  const opacity = useSharedValue(0.85);
   React.useEffect(() => {
    opacity.value = withRepeat(
    withSequence(
      withTiming(1, {
        duration: 1800,
      }),
      withTiming(0.6, {
        duration: 1800,
      }),
    ),
    -1,
    true
  );
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));


  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <LinearGradient
        colors={[colors.spaceDeep, colors.spaceMid, colors.spaceViolet, colors.spaceEdge]}
        locations={[0, 0.38, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Nebula clouds */}
    <Animated.View style = {[StyleSheet.absoluteFill, animatedStyle]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="nebulaPurple" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.accentPurple} stopOpacity={0.22} />
            <Stop offset="100%" stopColor={colors.accentPurple} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="nebulaTeal" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.accentTeal} stopOpacity={0.14} />
            <Stop offset="100%" stopColor={colors.accentTeal} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Circle cx={width * 0.78} cy={height * 0.16} r={width * 0.55} fill="url(#nebulaPurple)" />
        <Circle cx={width * 0.12} cy={height * 0.62} r={width * 0.5} fill="url(#nebulaTeal)" />
        <Circle cx={width * 0.65} cy={height * 0.88} r={width * 0.4} fill="url(#nebulaPurple)" />

        {stars.map((s, i) => (
          <Circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.twinkleTone ? colors.accentPurpleLight : colors.star}
            opacity={s.o}
          />
        ))}
      </Svg>
    </Animated.View>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
