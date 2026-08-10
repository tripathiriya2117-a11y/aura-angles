const express = require("express");
const Planet = require("../models/Planet");
const Collection = require("../models/Collection");
const Item = require("../models/Item");

const router = express.Router();

// GET all planets with real item counts
router.get("/", async (req, res) => {
  try {
    const planets = await Planet.find();

    const planetsWithCounts = await Promise.all(
      planets.map(async (planet) => {
        const collections = await Collection.find({
          planetId: planet.id,
        }).select("id");

        const collectionIds = collections.map(
          (collection) => collection.id
        );

        const itemCount =
          collectionIds.length === 0
            ? 0
            : await Item.countDocuments({
                collectionId: {
                  $in: collectionIds,
                },
              });

        return {
          ...planet.toObject(),
          itemCount,
        };
      })
    );

    res.json(planetsWithCounts);
  } catch (error) {
    console.error(
      "Failed to fetch planets:",
      error
    );

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
    console.error(
      "Failed to create planet:",
      error
    );

    res.status(500).json({
      message: "Failed to create planet",
    });
  }
});

// UPDATE a planet
router.put("/:id", async (req, res) => {
  try {
    const updatedPlanet =
      await Planet.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedPlanet) {
      return res.status(404).json({
        message: "Planet not found",
      });
    }

    res.json(updatedPlanet);
  } catch (error) {
    console.error(
      "Failed to update planet:",
      error
    );

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
    console.error(
      "Failed to delete planet:",
      error
    );

    res.status(500).json({
      message: "Failed to delete planet",
    });
  }
});

// GET one planet with real item count
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

    const collections = await Collection.find({
      planetId: planet.id,
    }).select("id");

    const collectionIds = collections.map(
      (collection) => collection.id
    );

    const itemCount =
      collectionIds.length === 0
        ? 0
        : await Item.countDocuments({
            collectionId: {
              $in: collectionIds,
            },
          });

    res.json({
      ...planet.toObject(),
      itemCount,
    });
  } catch (error) {
    console.error(
      "Failed to fetch planet:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch planet",
    });
  }
});

// GET collections for a planet with real item counts
router.get("/:id/collections", async (req, res) => {
  try {
    const collections = await Collection.find({
      planetId: req.params.id,
    });

    const collectionsWithCounts =
      await Promise.all(
        collections.map(async (collection) => {
          const count =
            await Item.countDocuments({
              collectionId: collection.id,
            });

          return {
            ...collection.toObject(),
            count,
          };
        })
      );

    res.json(collectionsWithCounts);
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

module.exports = router;