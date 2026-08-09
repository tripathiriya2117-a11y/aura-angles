import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemData } from "../types/item";

const ITEM_KEY = "AURA_ITEMS";

export async function saveItems(
  items: ItemData[]
): Promise<void> {
  await AsyncStorage.setItem(
    ITEM_KEY,
    JSON.stringify(items)
  );
}

export async function loadItems(): Promise<ItemData[] | null> {
  const data = await AsyncStorage.getItem(ITEM_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as ItemData[];
}