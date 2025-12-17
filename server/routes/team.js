import express from "express";
import TeamMember from "../models/TeamMember.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const members = await TeamMember.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean({ getters: true });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch team" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    console.error("Create team member error:", err);
    res.status(400).json({ message: "Failed to add member" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Team member not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update member" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Team member not found" });
    res.json({ message: "Team member removed" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete member" });
  }
});

export default router;


