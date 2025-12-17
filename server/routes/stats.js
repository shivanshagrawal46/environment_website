import express from "express";
import StatNumber from "../models/StatNumber.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Fixed labels admin can edit only numbers
const FIXED_LABELS = [
  "Trees Planted",
  "Corporate Partners",
  "Hectares Restored",
  "Client Retention",
  "Countries",
  "Tons CO2 Offset",
  "Species Protected",
  "Lives Impacted",
];

router.get("/", async (_req, res) => {
  try {
    const stats = await StatNumber.find().sort({ order: 1, createdAt: -1 }).lean({ getters: true });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Create or update by label (fixed list)
router.post("/", protect, async (req, res) => {
  try {
    const { label, value } = req.body || {};
    if (!FIXED_LABELS.includes(label)) {
      return res.status(400).json({ message: "Label not allowed. Use fixed labels only." });
    }

    const stat = await StatNumber.findOneAndUpdate(
      { label },
      { label, value, order: FIXED_LABELS.indexOf(label), category: "fixed" },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(stat);
  } catch (err) {
    console.error("Create/Update stat error:", err);
    res.status(400).json({ message: "Failed to create/update stat" });
  }
});

// Update by id but keep label fixed
router.put("/:id", protect, async (req, res) => {
  try {
    const { value } = req.body || {};
    const existing = await StatNumber.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Stat not found" });
    if (!FIXED_LABELS.includes(existing.label)) {
      return res.status(400).json({ message: "Label not allowed to edit" });
    }

    existing.value = value;
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(400).json({ message: "Failed to update stat" });
  }
});

// Prevent delete to keep fixed list stable
router.delete("/:id", protect, async (_req, res) => {
  return res.status(400).json({ message: "Deletion disabled for fixed statistics" });
});

export default router;


