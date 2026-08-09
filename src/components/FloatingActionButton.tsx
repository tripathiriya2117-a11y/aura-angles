import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface FloatingActionButtonProps {
  onPress?: () => void;
  bottom: number;
}

export function FloatingActionButton({ onPress, bottom }: FloatingActionButtonProps) {
  return (
    <View style={[styles.wrapper, { bottom }]} pointerEvents="box-none">
      <View style={styles.outerGlow} pointerEvents="none" />
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        hitSlop={10}
      >
        <LinearGradient
          colors={[colors.accentPurpleLight, colors.accentPurple, colors.accentPurpleDeep]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.innerHighlight} />
          <Ionicons name="add" size={28} color={colors.white} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const SIZE = 60;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 24,
    width: SIZE + 24,
    height: SIZE + 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    width: SIZE + 24,
    height: SIZE + 24,
    borderRadius: (SIZE + 24) / 2,
    backgroundColor: colors.accentPurple,
    opacity: 0.32,
  },
  pressable: {
    shadowColor: colors.accentPurpleDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 10,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  gradient: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 4,
    left: 8,
    width: SIZE * 0.5,
    height: SIZE * 0.3,
    borderRadius: SIZE * 0.25,
    backgroundColor: colors.white,
    opacity: 0.18,
  },
});