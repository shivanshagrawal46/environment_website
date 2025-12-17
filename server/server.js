import express from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory (one level up from server/)
dotenv.config({ path: path.join(__dirname, '../.env') });
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js";
import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contacts.js";
import teamRoutes from "./routes/team.js";
import aboutRoutes from "./routes/about.js";
import statRoutes from "./routes/stats.js";
import mediaRoutes from "./routes/media.js";
import categoryRoutes from "./routes/categories.js";
import tagRoutes from "./routes/tags.js";
import carbonRoutes from "./routes/carbon.js";
import reviewRoutes from "./routes/reviews.js";
import Admin from "./models/Admin.js";

const app = express();
const PORT = process.env.PORT || 5001;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pcbfoundation@k@h@";
const IS_PROD = (process.env.NODE_ENV ) === "production";

// CORS Configuration - only for local development
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400, // Cache preflight requests for 24 hours
};

// Rate limiting to prevent abuse and ensure consistent performance
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100, // Limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Allowlist certain routes from rate limiting (e.g., login)
const rateLimitAllowlist = ["/api/auth/login"];

// Trust proxy (for nginx / reverse proxy)
app.set("trust proxy", 1);

// Apply middleware in optimized order
if (!IS_PROD) {
  // Allow dev frontend to access API from different origin
app.use(cors(corsOptions));
}
app.use(compression()); // Enable gzip compression for all responses
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// Apply rate limiting to API routes except allowlisted paths
app.use((req, res, next) => {
  if (rateLimitAllowlist.includes(req.path)) return next();
  return limiter(req, res, next);
});

// Health check endpoint with caching
app.get("/api/health", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60"); // Cache for 1 minute
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    database: "environment",
    environment: process.env.NODE_ENV || "development"
  });
});

// Serve uploaded files statically (resolve absolute path)
const uploadsPath = path.resolve(__dirname, "../public/uploads");
console.log("📂 Serving static uploads from:", uploadsPath);

// Test endpoint to verify uploads path
app.get("/uploads-test", (req, res) => {
  const files = fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [];
  res.json({ 
    uploadsPath, 
    exists: fs.existsSync(uploadsPath),
    files: files.slice(0, 10) // Show first 10 files
  });
});

app.use("/uploads", express.static(uploadsPath));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/reviews", reviewRoutes);

const ensureAdminUser = async () => {
  const existing = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase() }).select("+password");
  if (!existing) {
    await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    console.log("✓ Default admin user created");
    return;
  }

  // If password override is provided, sync it
  if (ADMIN_PASSWORD && (await existing.matchPassword(ADMIN_PASSWORD)) === false) {
    existing.password = ADMIN_PASSWORD;
    await existing.save();
    console.log("✓ Admin password updated from environment");
  }
};

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});


