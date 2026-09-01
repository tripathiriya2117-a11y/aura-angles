import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { NavItem } from '../types/planet';

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  bottom: number;
}

const ICON_MAP: Record<NavItem['icon'], keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  planet: 'planet-outline',
  nova: 'sparkles',
  profile: 'person-circle-outline',
  tasks: 'checkbox',
};

export function BottomNav({ items, activeId, onSelect, bottom }: BottomNavProps) {
  return (
    <View style={[styles.wrapper, { bottom }]}>
      <BlurView intensity={40} tint="dark" style={styles.blur}>
        <View style={styles.inner}>
          {items.map((item) => {
            const active = item.id === activeId;
            const iconName = active
              ? (item.icon === 'planet' ? 'planet' : ICON_MAP[item.icon])
              : ICON_MAP[item.icon];
            return (
              <Pressable
                key={item.id}
                onPress={() => onSelect(item.id)}
                style={styles.item}
                hitSlop={8}
              >
                {active && <View style={styles.activePill} />}
                <Ionicons
                  name={iconName as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={active ? colors.textPrimary : colors.textTertiary}
                  style={styles.icon}
                />
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 24,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  blur: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: colors.glassFill,
  },
  item: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glassFillStrong,
    borderWidth: 1,
    borderColor: colors.glassBorderSoft,
  },
  icon: {
    zIndex: 1,
  },
});