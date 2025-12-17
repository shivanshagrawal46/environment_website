import mongoose from "mongoose";

const statNumberSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String },
    order: { type: Number, default: 0, index: true },
    category: { type: String, default: "impact", index: true },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Compound index for sorting by order
statNumberSchema.index({ order: 1, createdAt: -1 });
statNumberSchema.index({ category: 1, order: 1 });

// Optimize JSON output
statNumberSchema.set("toJSON", { virtuals: false, versionKey: false });
statNumberSchema.set("toObject", { virtuals: false, versionKey: false });

const StatNumber = mongoose.model("StatNumber", statNumberSchema);

export default StatNumber;


