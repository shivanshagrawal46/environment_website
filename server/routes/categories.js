import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all categories (or filter by type)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    
    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .lean({ getters: true });
    
    res.json({ data: categories });
  } catch (err) {
    console.error("List categories error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Get single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean({ getters: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
});

// Create category (protected)
router.post("/", protect, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(400).json({ message: err.code === 11000 ? "Category already exists" : "Failed to create category" });
  }
});

// Update category (protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update category error:", err);
    res.status(400).json({ message: "Failed to update category" });
  }
});

// Delete category (protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete category" });
  }
});

export default router;

