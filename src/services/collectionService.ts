import { CollectionData } from "../types/collection";

const API_URL = "https://aura-angles-api.onrender.com";

export async function getCollections(
  planetId: string
): Promise<CollectionData[]> {
  const response = await fetch(
    `${API_URL}/api/planets/${planetId}/collections`
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to fetch collections: ${response.status} ${error}`
    );
  }

  return (await response.json()) as CollectionData[];
}

export async function createCollection(
  collection: CollectionData
): Promise<CollectionData> {
  const response = await fetch(
    `${API_URL}/api/collections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collection),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to create collection: ${response.status} ${error}`
    );
  }

  return (await response.json()) as CollectionData;
}

export async function updateCollection(
  updatedCollection: CollectionData
): Promise<CollectionData> {
  const response = await fetch(
    `${API_URL}/api/collections/${updatedCollection.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCollection),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to update collection: ${response.status} ${error}`
    );
  }

  return (await response.json()) as CollectionData;
}

export async function deleteCollection(
  collectionId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/collections/${collectionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to delete collection: ${response.status} ${error}`
    );
  }
}