import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  onPress: () => void;
};

export default function FloatingAddButton({
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    right: 24,
    bottom: 34,

    width: 68,
    height: 68,

    borderRadius: 34,

    backgroundColor: colors.accentPurple,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: colors.accentPurple,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,
  },

  plus: {
    color: "white",
    fontSize: 34,
    fontWeight: "300",
  },
});