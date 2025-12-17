import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, unique: true, index: true },
    type: { type: String, enum: ["blog", "project"], required: true, index: true },
    description: { type: String },
    color: { type: String, default: "#4a6741" },
    order: { type: Number, default: 0, index: true },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Compound index for filtering by type
categorySchema.index({ type: 1, order: 1 });

// Auto-generate slug from name
categorySchema.pre("save", function (next) {
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
categorySchema.set("toJSON", { virtuals: false, versionKey: false });
categorySchema.set("toObject", { virtuals: false, versionKey: false });

const Category = mongoose.model("Category", categorySchema);

export default Category;

