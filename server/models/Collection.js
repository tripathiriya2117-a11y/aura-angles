const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    planetId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    count: {
      type: Number,
      default: 0,
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
    collection: "collections",
  }
);

module.exports = mongoose.model(
  "Collection",
  collectionSchema
);