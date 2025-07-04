const express = require("express");
const Task = require("../models/Task");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

// ✅ Get ALL tasks (no pagination), used for "Show All Tasks"
router.get("/all", isAuthenticated, async (req, res) => {
  const sortField = req.query.sortField || "dueDate";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ [sortField]: sortOrder });
    res.json({ tasks });
  } catch (err) {
    console.error("❌ Error fetching all tasks:", err);
    res.status(500).json({ message: "Failed to fetch all tasks" });
  }
});

// ✅ Get tasks with pagination & sorting
router.get("/", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortField = req.query.sortField || "dueDate";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  const skip = (page - 1) * limit;

  try {
    const [tasks, total] = await Promise.all([
      Task.find({ user: req.user.id })
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Task.countDocuments({ user: req.user.id }),
    ]);

    res.json({
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Error fetching paginated tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// ✅ Add new task
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, user: req.user.id });
    const saved = await newTask.save();
    res.json(saved);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ message: "Failed to save task" });
  }
});

// ✅ Update task
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ Delete task
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, user: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found or already deleted" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
