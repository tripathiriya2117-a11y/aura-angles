const express = require("express");
const Planet = require("../models/Planet");
const Collection = require("../models/Collection");
const Item = require("../models/Item");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      planets = [],
      collections = [],
      items = [],
    } = req.body;

    if (
      !Array.isArray(planets) ||
      !Array.isArray(collections) ||
      !Array.isArray(items)
    ) {
      return res.status(400).json({
        message:
          "planets, collections, and items must be arrays",
      });
    }

    // 1. Migrate planets
    for (const planet of planets) {
      await Planet.findOneAndUpdate(
        { id: planet.id },
        planet,
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        }
      );
    }

    // 2. Migrate collections
    for (const collection of collections) {
      await Collection.findOneAndUpdate(
        { id: collection.id },
        collection,
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        }
      );
    }

    // 3. Migrate items
    for (const item of items) {
      await Item.findOneAndUpdate(
        { id: item.id },
        item,
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        }
      );
    }

    res.json({
      success: true,
      migrated: {
        planets: planets.length,
        collections: collections.length,
        items: items.length,
      },
    });
  } catch (error) {
    console.error("Migration failed:", error);

    res.status(500).json({
      success: false,
      message: "Migration failed",
    });
  }
});

module.exports = router;