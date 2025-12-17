import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    console.error("Create contact error:", err);
    res.status(400).json({ message: "Failed to submit message" });
  }
});

router.get("/", protect, async (_req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean({ getters: true });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update message" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message removed" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete message" });
  }
});

export default router;


