import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
console.log("radius =", radius);
console.log("spacing =", spacing);

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function GlassCard({
  children,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",

    borderRadius: radius.lg,

    padding: spacing.md,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,
  },
});