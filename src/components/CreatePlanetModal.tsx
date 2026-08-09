import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreatePlanet: (name: string) => void;
};

export default function CreatePlanetModal({
  visible,
  onClose,
  onCreatePlanet,
}: Props) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreatePlanet(name);

    setName("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <Text style={styles.title}>
            Create Planet
          </Text>

          <TextInput
            placeholder="Planet name..."
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={onClose}
            >
              <Text style={styles.cancel}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreate}
            >
              <Text style={styles.create}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modal: {
    backgroundColor: colors.spaceMid,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    backgroundColor: colors.spaceDeep,
    color: colors.textPrimary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancel: {
    color: colors.textTertiary,
    fontSize: 17,
  },

  create: {
    color: colors.accentPurpleLight,
    fontSize: 17,
    fontWeight: "700",
  },
});