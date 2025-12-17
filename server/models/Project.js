import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
    content: { type: String }, // Rich text content for project details
    projectGoals: { type: String }, // Rich text for project goals section
    communityImpact: { type: String }, // Rich text for community impact section
    results: { type: String }, // Rich text for measurable results section
    category: { type: String, index: true }, // ONLY CATEGORY FOR PROJECTS
    impact: { type: String },
    location: { type: String },
    duration: { type: String }, // e.g., "2023 - Ongoing" or "2022 - 2024"
    mainImage: { type: String }, // Main featured image
    images: [{ type: String }], // Additional images gallery
    status: { type: String, enum: ["planning", "active", "completed"], default: "active", index: true },
    partners: [{ type: String }], // Array of partner organization names
    startDate: { type: Date },
    endDate: { type: Date },
    link: { type: String },
    featured: { type: Boolean, default: false, index: true },
    // Keep old field for backward compatibility
    image: { type: String },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Compound indexes for common query patterns
projectSchema.index({ status: 1, featured: -1 });
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ featured: 1, createdAt: -1 });

// Auto-generate slug from title if not provided
projectSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Optimize JSON output
projectSchema.set("toJSON", { virtuals: false, versionKey: false });
projectSchema.set("toObject", { virtuals: false, versionKey: false });

const Project = mongoose.model("Project", projectSchema);

export default Project;


