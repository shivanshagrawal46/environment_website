import express from "express";
import Review from "../models/Review.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const MAX_REVIEWS = 3;

// Get all reviews (public)
router.get("/", async (_req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .lean({ getters: true });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// Create review (admin, limit 3)
router.post("/", protect, async (req, res) => {
  try {
    const count = await Review.countDocuments();
    if (count >= MAX_REVIEWS) {
      return res.status(400).json({ message: `Limit of ${MAX_REVIEWS} reviews reached` });
    }
    const created = await Review.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Failed to create review" });
  }
});

// Update review
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Review not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update review" });
  }
});

// Delete review
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete review" });
  }
});

export default router;

