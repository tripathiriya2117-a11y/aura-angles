import AsyncStorage from "@react-native-async-storage/async-storage";
import { CollectionData } from "../types/collection";

const COLLECTION_KEY = "AURA_COLLECTIONS";

export async function saveCollections(
  collections: CollectionData[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      COLLECTION_KEY,
      JSON.stringify(collections)
    );
  } catch (error) {
    console.error(
      "Failed to save collections:",
      error
    );
    throw error;
  }
}

export async function loadCollections(): Promise<
  CollectionData[] | null
> {
  try {
    const data =
      await AsyncStorage.getItem(COLLECTION_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as CollectionData[];
  } catch (error) {
    console.error(
      "Failed to load collections:",
      error
    );
    throw error;
  }
}