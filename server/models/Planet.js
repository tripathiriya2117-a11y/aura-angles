const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    itemCount: {
      type: Number,
      default: 0,
    },

    size: {
      type: Number,
      default: 100,
    },

    top: {
      type: Number,
      default: 0,
    },

    left: {
      type: Number,
      default: 0,
    },

    coreColor: String,
    midColor: String,
    shadowColor: String,
    glowColor: String,
    ringColor: String,

    hasRing: {
      type: Boolean,
      default: false,
    },

    hasMoon: {
      type: Boolean,
      default: false,
    },

    moonOffset: Number,

    labelPosition: {
      type: String,
      enum: ["below", "right"],
      default: "below",
    },

    faded: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "planets",
  }
);

module.exports = mongoose.model("Planet", planetSchema);