const mongoose = require("mongoose");
require("dotenv").config();

const Planet = require("./models/Planet");

const planets = [
  {
    id: "design-studio",
    name: "Design Studio",
    itemCount: 24,
    size: 148,
    top: 120,
    left: 100,
    coreColor: "#7B61FF",
    midColor: "#B18CFF",
    shadowColor: "#2E1065",
    glowColor: "#7B61FF",
    ringColor: "#C4B5FD",
    hasRing: true,
    hasMoon: true,
  },

  {
    id: "travel-dreams",
    name: "Travel Dreams",
    itemCount: 38,
    size: 96,
    top: 400,
    left: 30,
    coreColor: "#42D9C8",
    midColor: "#8FF3FF",
    shadowColor: "#083344",
    glowColor: "#42D9C8",
    ringColor: "#99F6E4",
    hasRing: true,
    hasMoon: true,
  },

  {
    id: "reading",
    name: "Reading",
    itemCount: 12,
    size: 70,
    top: 60,
    left: 300,
    coreColor: "#F59E0B",
    midColor: "#FFD48A",
    shadowColor: "#5A2E04",
    glowColor: "#F59E0B",
    hasRing: false,
    hasMoon: false,
    labelPosition: "right",
    faded: true,
  },

  {
    id: "fitness",
    name: "Fitness",
    itemCount: 9,
    size: 54,
    top: 270,
    left: -30,
    coreColor: "#F472B6",
    midColor: "#FBC7E3",
    shadowColor: "#5B1042",
    glowColor: "#F472B6",
    hasRing: false,
    hasMoon: false,
    faded: true,
  },

  {
    id: "finance",
    name: "Finance",
    itemCount: 16,
    size: 44,
    top: 600,
    left: 300,
    coreColor: "#34D399",
    midColor: "#A7F3D0",
    shadowColor: "#064E3B",
    glowColor: "#34D399",
    hasRing: false,
    hasMoon: false,
    faded: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    for (const planet of planets) {
      await Planet.findOneAndUpdate(
        { id: planet.id },
        planet,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`Seeded: ${planet.name}`);
    }

    console.log("Planet seed complete");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();