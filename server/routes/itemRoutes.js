const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

// CREATE an item
router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body);

    const savedItem = await item.save();

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Failed to create item:", error);

    res.status(500).json({
      message: "Failed to create item",
    });
  }
});

// UPDATE an item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Failed to update item:", error);

    res.status(500).json({
      message: "Failed to update item",
    });
  }
});

// DELETE an item
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json({
      message: "Item deleted",
      item: deletedItem,
    });
  } catch (error) {
    console.error("Failed to delete item:", error);

    res.status(500).json({
      message: "Failed to delete item",
    });
  }
});

module.exports = router;