const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["task", "deadline", "reminder"],
      default: "task",
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "archived"],
      default: "not_started",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueAt: {
      type: Date,
    },

    reminderAt: {
      type: Date,
    },

    source: {
      type: String,
      enum: ["victor", "manual"],
      default: "victor",
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "tasks",
  }
);

module.exports = mongoose.model("Task", taskSchema);
