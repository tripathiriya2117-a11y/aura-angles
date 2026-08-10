import { PlanetData } from "../types/planet";

const API_URL = "https://aura-angles-api.onrender.com";

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