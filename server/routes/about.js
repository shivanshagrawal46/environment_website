import express from "express";
import AboutPage from "../models/AboutPage.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const about = await AboutPage.findOne().sort({ updatedAt: -1 }).lean({ getters: true });
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch about content" });
  }
});

router.put("/", protect, async (req, res) => {
  try {
    const about = await AboutPage.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    res.json(about);
  } catch (err) {
    res.status(400).json({ message: "Failed to update about content" });
  }
});

export default router;


