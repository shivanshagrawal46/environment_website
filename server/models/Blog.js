import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    extra: { type: String }, // Additional rich text content
    mainImage: { type: String }, // Main featured image
    images: [{ type: String }], // Additional images gallery
    author: { type: String, default: "Admin" },
    authorImage: { type: String }, // Author profile image
    authorAvatar: { type: String }, // Author avatar (alternative field name)
    readTime: { type: String }, // e.g., "5 min read"
    tags: [{ type: String }], // ONLY TAGS FOR BLOGS
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, index: true },
    // Keep old field for backward compatibility
    coverImage: { type: String },
  },
  { 
    timestamps: true,
    // Optimize collection settings
    collation: { locale: "en", strength: 2 },
  }
);

// Compound index for common queries (status + publishedAt)
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 }); // Index for tag searches

blogSchema.pre("save", function (next) {
  // Auto-generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Lean queries by default for better performance
blogSchema.set("toJSON", { virtuals: false, versionKey: false });
blogSchema.set("toObject", { virtuals: false, versionKey: false });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;


