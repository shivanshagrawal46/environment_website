import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Media from "../models/Media.js";
import { protect } from "../middleware/auth.js";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
// Use path.resolve to ensure absolute path (matching server.js)
const uploadsDir = path.resolve(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadsDir);
} else {
  console.log("📁 Using uploads directory:", uploadsDir);
}

// Configure multer for memory storage (we'll process with sharp)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Only accept images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max (will be optimized to 300KB)
  },
});

// Upload image with optimization
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { alt, caption } = req.body;

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = ".webp"; // Convert all to WebP for better compression
    const filename = `${timestamp}-${randomStr}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    
    // Log paths for debugging
    console.log("📤 Upload attempt:", {
      uploadsDir,
      filename,
      filepath,
      uploadsDirExists: fs.existsSync(uploadsDir)
    });

    // Optimize image with sharp
    const imageBuffer = await sharp(req.file.buffer)
      .resize(1920, 1920, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Check if optimized size is still too large
    let finalBuffer = imageBuffer;
    let quality = 80;

    while (finalBuffer.length > 300 * 1024 && quality > 20) {
      quality -= 10;
      finalBuffer = await sharp(req.file.buffer)
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toBuffer();
    }

    // Ensure uploads directory exists before writing
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("📁 Created uploads directory:", uploadsDir);
    }

    // Save the optimized image with error handling
    try {
      fs.writeFileSync(filepath, finalBuffer);
    } catch (writeError) {
      console.error("❌ File write error:", writeError);
      throw new Error(`Failed to write file to disk: ${writeError.message}`);
    }
    
    // Verify file was written and is readable
    if (!fs.existsSync(filepath)) {
      throw new Error(`File was not created at: ${filepath}`);
    }
    
    // Verify file size matches
    const stats = fs.statSync(filepath);
    if (stats.size !== finalBuffer.length) {
      console.warn(`⚠️ File size mismatch: expected ${finalBuffer.length}, got ${stats.size}`);
    }

    // Get image metadata
    const metadata = await sharp(finalBuffer).metadata();

    // Create media record only after file is confirmed saved
    const url = `/uploads/${filename}`;
    const media = await Media.create({
      filename,
      originalName: req.file.originalname,
      url,
      mimeType: "image/webp",
      size: finalBuffer.length,
      width: metadata.width,
      height: metadata.height,
      alt: alt || "",
      caption: caption || "",
      uploadedBy: req.user.id,
    });

    console.log("✅ Image uploaded successfully:", {
      filename,
      filepath,
      url,
      size: finalBuffer.length,
      dimensions: `${metadata.width}x${metadata.height}`
    });
    res.status(201).json(media);
  } catch (err) {
    console.error("❌ Upload error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      uploadsDir,
      filename: req.file?.originalname
    });
    res.status(500).json({ message: "Failed to upload image", error: err.message });
  }
});

// Get all media
router.get("/", protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const media = await Media.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean({ getters: true });

    const total = await Media.countDocuments();

    res.json({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("List media error:", err);
    res.status(500).json({ message: "Failed to fetch media" });
  }
});

// Get single media
router.get("/:id", protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).lean({ getters: true });
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch media" });
  }
});

// Update media metadata
router.put("/:id", protect, async (req, res) => {
  try {
    const { alt, caption } = req.body;
    const updated = await Media.findByIdAndUpdate(
      req.params.id,
      { alt, caption },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Media not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update media" });
  }
});

// Delete media
router.delete("/:id", protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Delete file from filesystem
    const filepath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Delete from database
    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Delete media error:", err);
    res.status(500).json({ message: "Failed to delete media" });
  }
});

export default router;

