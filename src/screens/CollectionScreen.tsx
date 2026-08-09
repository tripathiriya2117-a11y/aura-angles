import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { colors } from "../theme/colors";
import { RootStackParamList } from "../navigation/AppNavigator";
import PlanetHero from "../components/PlanetHero";
import CollectonCard from "../components/CollectionCard";
import FloatingAddButton from "../components/FloatingAddButton";
import CreateCollectionModal from "../components/CreateCollectionModal";

import {
  createCollection,
  getCollections,
  updateCollection,
  deleteCollection,
} from "../services/collectionService";

import { CollectionData } from "../types/collection";

export default function CollectionScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const route =
    useRoute<
      NativeStackScreenProps<
        RootStackParamList,
        "Collection"
      >["route"]
    >();

  const { planet } = route.params;

  const [collections, setCollections] =
    useState<CollectionData[]>([]);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedCollection, setSelectedCollection] =
  useState<CollectionData | null>(null);

const [editVisible, setEditVisible] =
  useState(false);

const [editName, setEditName] =
  useState("");  

 
  useEffect(() => {
    async function loadPlanetCollections() {
      try {
        const savedCollections =
          await getCollections(planet.id);

        setCollections(savedCollections);
      } catch (error) {
        console.error(
          "Failed to load collections:",
          error
        );
      }
    }

    loadPlanetCollections();
  }, [planet.id]);

  async function handleCreateCollection(name: string) {
    try {
      const now = new Date().toISOString();

      const newCollection: CollectionData = {
        id: Date.now().toString(),
        planetId: planet.id,
        title: name.trim(),
        count: 0,
        createdAt: now,
        updatedAt: now,
      };

      await createCollection(newCollection);

      setCollections((previous) => [
        ...previous,
        newCollection,
      ]);

      setModalVisible(false);
    } catch (error) {
      console.error(
        "Failed to create collection:",
        error
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <PlanetHero planet={planet} />

        <Text style={styles.title}>
          {planet.name}
        </Text>

        <Text style={styles.subtitle}>
          {planet.itemCount} items
        </Text>
      </View>

      <ScrollView
  style={styles.collectionList}
  contentContainerStyle={styles.collectionContent}
  showsVerticalScrollIndicator={false}
>
  {collections.map((collection, index) => (
    <CollectonCard
      key={collection.id}
      collection={collection}
      index={index}
      onPress={() => {
        console.log(
          "COLLECTION PRESSED:",
          collection.title
        );

        navigation.navigate("Items", {
          collection,
        });
      }}
      onLongPress={() => {
        setSelectedCollection(collection);
      }}
    />
  ))}
</ScrollView>
      <FloatingAddButton
        onPress={() => setModalVisible(true)}
      />

      <CreateCollectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCollection}
      />

      {selectedCollection && (
  <Modal
    transparent
    animationType="fade"
    visible={!!selectedCollection}
    onRequestClose={() =>
      setSelectedCollection(null)
    }
  >
    <Pressable
      style={styles.menuBackdrop}
      onPress={() =>
        setSelectedCollection(null)
      }
    >
      <View style={styles.menu}>
        <Text style={styles.menuTitle}>
          {selectedCollection.title}
        </Text>

        <Pressable
          style={styles.menuButton}
          onPress={() => {
            setEditName(
              selectedCollection.title
            );
            setEditVisible(true);
          }}
        >
          <Text style={styles.menuText}>
            ✏️ Edit
          </Text>
        </Pressable>

        <Pressable
          style={styles.menuButton}
          onPress={() => {
            const collection =
              selectedCollection;

            setSelectedCollection(null);

            Alert.alert(
              "Delete collection?",
              `Delete "${collection.title}"?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteCollection(
                        collection.id
                      );

                      setCollections(
                        (current) =>
                          current.filter(
                            (item) =>
                              item.id !==
                              collection.id
                          )
                      );
                    } catch (error) {
                      console.error(
                        "Failed to delete collection:",
                        error
                      );
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteText}>
            🗑 Delete
          </Text>
        </Pressable>

        <Pressable
          style={styles.menuButton}
          onPress={() =>
            setSelectedCollection(null)
          }
        >
          <Text style={styles.menuText}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Pressable>
  </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 24,
  },

  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    color: colors.textTertiary,
    fontSize: 18,
  },

  collectionList: {
    width: "100%",
    flex: 1,
  },
  collectionContent: {
  paddingBottom: 120,
},

menuBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.55)",
  justifyContent: "center",
  alignItems: "center",
},

menu: {
  width: "80%",
  backgroundColor: colors.spaceMid,
  borderRadius: 24,
  padding: 22,
},

menuTitle: {
  color: colors.textPrimary,
  fontSize: 20,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 16,
},

menuButton: {
  paddingVertical: 14,
  alignItems: "center",
},

menuText: {
  color: colors.textPrimary,
  fontSize: 16,
  fontWeight: "600",
},

deleteText: {
  color: "#FF6B6B",
  fontSize: 16,
  fontWeight: "600",
},

editInput: {
  backgroundColor: colors.spaceDeep,
  color: colors.textPrimary,
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  marginBottom: 10,
},
});