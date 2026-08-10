import { ItemData } from "../types/item";

const API_URL = "https://aura-angles-api.onrender.com";

export async function getItems(
  collectionId: string
): Promise<ItemData[]> {
  const response = await fetch(
    `${API_URL}/api/collections/${collectionId}/items`
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to fetch items: ${response.status} ${error}`
    );
  }

  return (await response.json()) as ItemData[];
}

export async function createItem(
  item: ItemData
): Promise<ItemData> {
  const response = await fetch(
    `${API_URL}/api/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to create item: ${response.status} ${error}`
    );
  }

  return (await response.json()) as ItemData;
}

export async function updateItem(
  updatedItem: ItemData
): Promise<ItemData> {
  const response = await fetch(
    `${API_URL}/api/items/${updatedItem.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to update item: ${response.status} ${error}`
    );
  }

  return (await response.json()) as ItemData;
}

export async function deleteItem(
  itemId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/items/${itemId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to delete item: ${response.status} ${error}`
    );
  }
}