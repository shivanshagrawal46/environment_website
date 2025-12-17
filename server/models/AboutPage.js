import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const aboutPageSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "About Us" },
    heroSubtitle: { type: String },
    heroImage: { type: String },
    body: { type: String },
    mission: { type: String },
    vision: { type: String },
    values: [{ type: String }],
    story: { type: String }, // Our story/history
    milestones: [{
      year: { type: String },
      title: { type: String },
      description: { type: String }
    }],
    highlights: [highlightSchema],
    impactStats: [{
      value: { type: String },
      label: { type: String },
      description: { type: String }
    }],
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Index on updatedAt for fetching the latest version
aboutPageSchema.index({ updatedAt: -1 });

// Optimize JSON output
aboutPageSchema.set("toJSON", { virtuals: false, versionKey: false });
aboutPageSchema.set("toObject", { virtuals: false, versionKey: false });

const AboutPage = mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;


