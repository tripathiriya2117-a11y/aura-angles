const express = require("express");
const Planet = require("../models/Planet");

const router = express.Router();

// GET all planets
router.get("/", async (req, res) => {
  try {
    const planets = await Planet.find();

    res.json(planets);
  } catch (error) {
    console.error("Failed to fetch planets:", error);

    res.status(500).json({
      message: "Failed to fetch planets",
    });
  }
});

// CREATE a planet
router.post("/", async (req, res) => {
  try {
    const planet = new Planet(req.body);

    const savedPlanet = await planet.save();

    res.status(201).json(savedPlanet);
  } catch (error) {
    console.error("Failed to create planet:", error);

    res.status(500).json({
      message: "Failed to create planet",
    });
  }
});

// UPDATE a planet
router.put("/:id", async (req, res) => {
  try {
    const updatedPlanet = await Planet.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPlanet) {
      return res.status(404).json({
        message: "Planet not found",
      });
    }

    res.json(updatedPlanet);
  } catch (error) {
    console.error("Failed to update planet:", error);

    res.status(500).json({
      message: "Failed to update planet",
    });
  }
});

// DELETE a planet
router.delete("/:id", async (req, res) => {
  try {
    const planet = await Planet.findOneAndDelete({
      id: req.params.id,
    });

    if (!planet) {
      return res.status(404).json({
        message: "Planet not found",
      });
    }

    res.json({
      message: "Planet deleted",
      planet,
    });
  } catch (error) {
    console.error("Failed to delete planet:", error);

    res.status(500).json({
      message: "Failed to delete planet",
    });
  }
});

// GET one planet by ID
router.get("/:id", async (req, res) => {
  try {
    const planet = await Planet.findOne({
      id: req.params.id,
    });

    if (!planet) {
      return res.status(404).json({
        message: "Planet not found",
      });
    }

    res.json(planet);
  } catch (error) {
    console.error("Failed to fetch planet:", error);

    res.status(500).json({
      message: "Failed to fetch planet",
    });
  }
});

router.get("/:id/collections", async (req, res) => {
  try {
    const Collection = require("../models/Collection");

    const collections = await Collection.find({
      planetId: req.params.id,
    });

    res.json(collections);
  } catch (error) {
    console.error(
      "Failed to fetch planet collections:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch planet collections",
    });
  }
});

// CREATE a collection
router.post("/", async (req, res) => {
  try {
    const collection = new Collection(req.body);

    const savedCollection = await collection.save();

    res.status(201).json(savedCollection);
  } catch (error) {
    console.error("Failed to create collection:", error);

    res.status(500).json({
      message: "Failed to create collection",
    });
  }
});

module.exports = router;