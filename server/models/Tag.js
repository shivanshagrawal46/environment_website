import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
    color: { type: String, default: "#8b9d83" },
    usageCount: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Index for sorting by usage
tagSchema.index({ usageCount: -1 });

// Auto-generate slug from name
tagSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

// Optimize JSON output
tagSchema.set("toJSON", { virtuals: false, versionKey: false });
tagSchema.set("toObject", { virtuals: false, versionKey: false });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;

