import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlanetData } from "../types/planet";

const PLANET_KEY = "AURA_PLANETS";

export async function savePlanets(
  planets: PlanetData[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      PLANET_KEY,
      JSON.stringify(planets)
    );
  } catch (error) {
    console.error("Failed to save planets:", error);
    throw error;
  }
}

export async function loadPlanets(): Promise<PlanetData[] | null> {
  try {
    const data = await AsyncStorage.getItem(PLANET_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as PlanetData[];
  } catch (error) {
    console.error("Failed to load planets:", error);
    throw error;
  }
}