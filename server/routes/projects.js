import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { status, featured } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (featured) filter.featured = featured === "true";

  try {
    const projects = await Project.find(filter).sort({ createdAt: -1 }).lean({ getters: true });
    res.json(projects);
  } catch (err) {
    console.error("List projects error:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    let project;
    
    // Try to find by ID first (if it's a valid MongoDB ObjectId)
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(identifier).lean({ getters: true });
    }
    
    // If not found by ID or not a valid ID, try slug
    if (!project) {
      project = await Project.findOne({ slug: identifier }).lean({ getters: true });
    }
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Fetch project error:", err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(400).json({ message: "Failed to create project" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(400).json({ message: "Failed to update project" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project removed" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete project" });
  }
});

export default router;


