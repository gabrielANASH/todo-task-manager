const express = require("express");
const Task = require("../models/Task");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

// Get tasks for user
router.get("/", isAuthenticated, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Add new task
router.post("/", isAuthenticated, async (req, res) => {
  const newTask = new Task({ ...req.body, user: req.user.id });
  const saved = await newTask.save();
  res.json(saved);
});

// Update a task
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete
router.delete("/:id", isAuthenticated, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: "Task deleted" });
});

module.exports = router;
