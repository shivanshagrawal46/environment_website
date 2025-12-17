import express from "express";
import Blog from "../models/Blog.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const buildSlug = (title, provided) => {
  const base = provided || title || "post";
  return base
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

router.get("/", async (req, res) => {
  const { status = "published" } = req.query;
  const filter = status === "all" ? {} : { status };

  try {
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean({ getters: true });
    res.json(blogs);
  } catch (err) {
    console.error("List blogs error:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean({ getters: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, slug, ...rest } = req.body || {};
    const blog = await Blog.create({
      title,
      slug: buildSlug(title, slug),
      ...rest,
    });
    res.status(201).json(blog);
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(400).json({ message: "Failed to create blog" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { title, slug, ...rest } = req.body || {};
    const updates = { ...rest };
    if (title) updates.title = title;
    if (title || slug) updates.slug = buildSlug(title || slug, slug);

    const updated = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Blog not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update blog error:", err);
    res.status(400).json({ message: "Failed to update blog" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog removed" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete blog" });
  }
});

export default router;


