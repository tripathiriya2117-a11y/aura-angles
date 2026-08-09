import { ItemData } from "../types/item";
import {
  loadItems,
  saveItems,
} from "../storage/itemStorage";

export async function getItems(
  collectionId: string
): Promise<ItemData[]> {
  const items = await loadItems();

  return (items ?? []).filter(
    (item) => item.collectionId === collectionId
  );
}

export async function createItem(
  item: ItemData
): Promise<ItemData> {
  const items = await loadItems();
  const existing = items ?? [];

  if (
    existing.some(
      (existingItem) => existingItem.id === item.id
    )
  ) {
    throw new Error(
      `Item with ID "${item.id}" already exists.`
    );
  }

  await saveItems([...existing, item]);

  return item;
}