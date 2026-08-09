const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    collectionId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "link"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      required: true,
    },

    updatedAt: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "items",
  }
);

module.exports = mongoose.model("Item", itemSchema);