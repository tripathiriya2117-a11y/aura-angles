import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  worldCount: number;
  onSearchPress?: () => void;
}

export function Header({ worldCount, onSearchPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrow}>YOUR UNIVERSE</Text>
          <View style={styles.dot} />
          <View style={styles.countPill}>
            <View style={styles.countDot} />
            <Text style={styles.countText}>{worldCount} WORLDS</Text>
          </View>
        </View>
        <Text style={styles.title}>Galaxy</Text>
      </View>

      <Pressable
        onPress={onSearchPress}
        style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
        hitSlop={8}
      >
        <Ionicons name="search" size={19} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  left: {
    flexShrink: 1,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eyebrow: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 8,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accentPurpleLight,
    marginRight: 6,
  },
  countText: {
    color: colors.accentPurpleLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glassFillStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});