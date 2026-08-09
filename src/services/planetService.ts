import { PlanetData } from "../types/planet";
import {
  loadPlanets,
} from "../storage/planetStorage";




//import { loadPlanets,} from "../storage/planetStorage";

import {
  loadCollections,
} from "../storage/collectionStorage";

import {
  loadItems,
} from "../storage/itemStorage";

const API_URL = "http://10.97.213.135:5000";

export async function migrateLocalData() {
  const planets = await loadPlanets();
  const collections = await loadCollections();
  const items = await loadItems();

  const response = await fetch(
    `${API_URL}/api/migrate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planets: planets ?? [],
        collections: collections ?? [],
        items: items ?? [],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Migration failed: ${response.status}`
    );
  }

  return response.json();
}







//const API_URL = "http://10.97.213.135:5000";

export async function getPlanets(): Promise<PlanetData[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/planets`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch planets: ${response.status}`
      );
    }

    const planets =
      (await response.json()) as PlanetData[];

    return planets;
  } catch (error) {
    console.error(
      "Failed to fetch planets from API:",
      error
    );

    throw error;
  }
}

export async function createPlanet(
  planet: PlanetData
): Promise<PlanetData> {
  const response = await fetch(
    `${API_URL}/api/planets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planet),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to create planet: ${response.status} ${error}`
    );
  }

  return await response.json();
}

export async function updatePlanet(
  updatedPlanet: PlanetData
): Promise<PlanetData> {
  const response = await fetch(
    `${API_URL}/api/planets/${updatedPlanet.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlanet),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to update planet: ${response.status} ${error}`
    );
  }

  return await response.json();
}

export async function deletePlanet(
  planetId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/planets/${planetId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to delete planet: ${response.status} ${error}`
    );
  }
}