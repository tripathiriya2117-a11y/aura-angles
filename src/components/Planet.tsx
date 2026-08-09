import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme/colors';
import { PlanetData } from '../types/planet';
import Animated, {useSharedValue, useAnimatedStyle, withSpring, } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface PlanetProps {
  planet: PlanetData;
  onPress?: (planet: PlanetData) => void;
  onLongPress?: (planet: PlanetData) => void;
}

export function Planet({ planet, onPress, onLongPress }: PlanetProps) {
  const scale = useSharedValue(1);
  const {
    id,
    name,
    itemCount,
    size,
    top,
    left,
    coreColor,
    midColor,
    shadowColor,
    glowColor,
    ringColor,
    hasRing,
    hasMoon,
    moonOffset = 0.36,
    labelPosition = 'below',
    faded,
  } = planet;
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
     .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
     });

   

  const float = useSharedValue(0);
  const glowSize = size * 2.6;
  const svgSize = size * 1.9;
  const center = svgSize / 2;
  const radius = size / 2;
  const ringRx = radius * 1.55;
  const ringRy = radius * 0.42;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value}, {translateY: translateY.value}],
  }));

  return (
    <GestureDetector gesture={pan}>
    <Animated.View style={animatedStyle}>
        <Pressable
  onPress={() => {
    scale.value = withSpring(1.08);

    setTimeout(() => {
      scale.value = withSpring(1);
    }, 120);

    onPress?.(planet);
  }}
  onLongPress={() => {
    onLongPress?.(planet);
  }}
  delayLongPress={350} 
       style={[
        styles.wrapper,
        { top, left, width: glowSize, opacity: faded ? 0.55 : 1 },
      ]}
      hitSlop={12}
    >
      
      <View
        style={[
          styles.glow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: glowColor,
          },
        ]}
      />

      <Svg width={svgSize} height={svgSize} style={styles.svg}>
        <Defs>
          <RadialGradient id={`sphere-${id}`} cx="38%" cy="32%" r="70%">
            <Stop offset="0%" stopColor={midColor} stopOpacity={1} />
            <Stop offset="55%" stopColor={coreColor} stopOpacity={1} />
            <Stop offset="100%" stopColor={shadowColor} stopOpacity={1} />
          </RadialGradient>
          <RadialGradient id={`rim-${id}`} cx="50%" cy="50%" r="50%">
            <Stop offset="78%" stopColor={coreColor} stopOpacity={0} />
            <Stop offset="100%" stopColor={shadowColor} stopOpacity={0.55} />
          </RadialGradient>
        </Defs>

        {hasRing && (
          <Ellipse
            cx={center}
            cy={center}
            rx={ringRx}
            ry={ringRy}
            stroke={ringColor ?? coreColor}
            strokeWidth={size * 0.045}
            strokeOpacity={0.85}
            fill="none"
          />
        )}

        <Circle cx={center} cy={center} r={radius} fill={`url(#sphere-${id})`} />
        <Circle cx={center} cy={center} r={radius} fill={`url(#rim-${id})`} />

        {hasRing && (
          <Ellipse
            cx={center}
            cy={center}
            rx={ringRx}
            ry={ringRy}
            stroke={ringColor ?? coreColor}
            strokeWidth={size * 0.045}
            strokeOpacity={0.35}
            fill="none"
            strokeDasharray={`${ringRx * 1.7}, ${ringRx * 3.4}`}
          />
        )}

        {hasMoon && (
          <Circle
            cx={center + radius * (1 + moonOffset)}
            cy={center - radius * 0.55}
            r={size * 0.06}
            fill={colors.starDim}
            opacity={0.9}
          />
        )}
      </Svg>

      <View
        style={[
          styles.label,
          labelPosition === 'right'
            ? { left: glowSize * 0.66, top: glowSize * 0.4 }
            : { top: glowSize * 0.72, alignItems: 'center', width: glowSize },
        ]}
      >
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.count, { color: glowColor }]}>{itemCount} items</Text>
      </View>
    </Pressable>
    </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    opacity: 0.35,
  },
  svg: {
    alignSelf: 'center',
  },
  label: {
    position: 'absolute',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  count: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
    opacity: 0.9,
  },
});