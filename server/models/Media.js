import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true, index: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true }, // in bytes
    width: { type: Number },
    height: { type: Number },
    alt: { type: String },
    caption: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Index for faster queries
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ mimeType: 1 });

// Optimize JSON output
mediaSchema.set("toJSON", { virtuals: false, versionKey: false });
mediaSchema.set("toObject", { virtuals: false, versionKey: false });

const Media = mongoose.model("Media", mediaSchema);

export default Media;

