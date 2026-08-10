const express = require("express");
const Collection = require("../models/Collection");
const Item = require("../models/Item");

const router = express.Router();

// GET all collections for a planet
router.get("/planet/:planetId", async (req, res) => {
  try {
    const collections = await Collection.find({
      planetId: req.params.planetId,
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
// GET all items for a collection
router.get("/:id/items", async (req, res) => {
  try {
    const items = await Item.find({
      collectionId: req.params.id,
    });

    res.json(items);
  } catch (error) {
    console.error(
      "Failed to fetch collection items:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch collection items",
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

// UPDATE a collection
router.put("/:id", async (req, res) => {
  try {
    const updatedCollection = await Collection.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedCollection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.json(updatedCollection);
  } catch (error) {
    console.error("Failed to update collection:", error);

    res.status(500).json({
      message: "Failed to update collection",
    });
  }
});

// DELETE a collection
router.delete("/:id", async (req, res) => {
  try {
    const deletedCollection = await Collection.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedCollection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.json({
      message: "Collection deleted",
      collection: deletedCollection,
    });
  } catch (error) {
    console.error("Failed to delete collection:", error);

    res.status(500).json({
      message: "Failed to delete collection",
    });
  }
});

module.exports = router;