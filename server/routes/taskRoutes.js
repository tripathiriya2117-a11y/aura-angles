const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// CREATE a task
router.post("/", async (req, res) => {
  try {
    const taskData = { ...req.body };

    if (!taskData.id) {
      taskData.id = generateId();
    }

    const task = new Task(taskData);

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Failed to create task:", error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// GET upcoming tasks (not completed/archived)
router.get("/upcoming", async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      status: { $nin: ["completed", "archived"] },
      $or: [
        { dueAt: { $gt: now } },
        { dueAt: { $exists: false } },
        { dueAt: null },
      ],
    }).sort({ dueAt: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch upcoming tasks:", error);

    res.status(500).json({
      message: "Failed to fetch upcoming tasks",
    });
  }
});

// GET tasks due today
router.get("/today", async (req, res) => {
  try {
    const now = new Date();

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      status: { $nin: ["completed", "archived"] },
      dueAt: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ dueAt: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch today's tasks:", error);

    res.status(500).json({
      message: "Failed to fetch today's tasks",
    });
  }
});

// UPDATE a task
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// MARK TASK COMPLETE
router.put("/:id/complete", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id },
      { status: "completed", updatedAt: new Date() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Failed to complete task:", error);

    res.status(500).json({
      message: "Failed to complete task",
    });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Failed to delete task:", error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

module.exports = router;
