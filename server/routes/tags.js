import express from "express";
import Tag from "../models/Tag.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all tags
router.get("/", async (req, res) => {
  try {
    const { sort = "name" } = req.query;
    
    const sortOptions = {
      name: { name: 1 },
      usage: { usageCount: -1 },
      recent: { createdAt: -1 },
    };
    
    const tags = await Tag.find()
      .sort(sortOptions[sort] || { name: 1 })
      .lean({ getters: true });
    
    res.json({ data: tags });
  } catch (err) {
    console.error("List tags error:", err);
    res.status(500).json({ message: "Failed to fetch tags" });
  }
});

// Get single tag
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id).lean({ getters: true });
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tag" });
  }
});

// Create tag (protected)
router.post("/", protect, async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    console.error("Create tag error:", err);
    res.status(400).json({ message: err.code === 11000 ? "Tag already exists" : "Failed to create tag" });
  }
});

// Update tag (protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ message: "Tag not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update tag error:", err);
    res.status(400).json({ message: "Failed to update tag" });
  }
});

// Delete tag (protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tag not found" });
    res.json({ message: "Tag deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete tag" });
  }
});

export default router;

