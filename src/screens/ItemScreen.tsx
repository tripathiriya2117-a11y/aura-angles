import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { colors } from "../theme/colors";
import { RootStackParamList } from "../navigation/AppNavigator";
import { CollectionData } from "../types/collection";
import { ItemData } from "../types/item";
import {
  createItem,
  getItems,
} from "../services/itemService";

export default function ItemScreen() {
  const route =
    useRoute<
      NativeStackScreenProps<
        RootStackParamList,
        "Items"
      >["route"]
    >();

  const { collection } = route.params;

  const [items, setItems] = useState<ItemData[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadCollectionItems() {
      try {
        const savedItems = await getItems(collection.id);
        setItems(savedItems);
      } catch (error) {
        console.error(
          "Failed to load items:",
          error
        );
      }
    }

    loadCollectionItems();
  }, [collection.id]);

  async function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    try {
      const now = new Date().toISOString();

      const newItem: ItemData = {
        id: Date.now().toString(),
        collectionId: collection.id,
        type: "text",
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: now,
        updatedAt: now,
      };

      await createItem(newItem);

      setItems((previous) => [
        ...previous,
        newItem,
      ]);

      setTitle("");
      setContent("");
    } catch (error) {
      console.error(
        "Failed to save item:",
        error
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {collection.title}
      </Text>

      <Text style={styles.subtitle}>
        {items.length} items
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
      />

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write something..."
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, styles.contentInput]}
        multiline
      />

      <Pressable
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          Save
        </Text>
      </Pressable>

      <View style={styles.items}>
        {items.map((item) => (
          <View
            key={item.id}
            style={styles.itemCard}
          >
            <Text style={styles.itemTitle}>
              {item.title}
            </Text>

            <Text style={styles.itemContent}>
              {item.content}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
    paddingTop: 70,
    paddingHorizontal: 24,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.textTertiary,
    marginTop: 6,
    marginBottom: 24,
  },

  input: {
    backgroundColor: colors.spaceMid,
    color: colors.textPrimary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },

  contentInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: colors.accentPurple,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  items: {
    marginTop: 24,
  },

  itemCard: {
    backgroundColor: colors.spaceMid,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  itemTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  itemContent: {
    color: colors.textTertiary,
    marginTop: 6,
    lineHeight: 21,
  },
});