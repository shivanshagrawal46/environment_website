import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    role: { type: String, required: true, index: true },
    department: { type: String },
    bio: { type: String },
    detailedBio: { type: String }, // Longer bio for detail page
    photo: { type: String },
    coverImage: { type: String }, // Hero image for detail page
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    expertise: [{ type: String }], // Array of expertise areas
    achievements: [{ type: String }], // Array of achievements
    education: { type: String },
    yearsOfExperience: { type: Number },
    socials: {
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Compound index for the most common query (active members sorted by order)
teamMemberSchema.index({ active: 1, order: 1, createdAt: -1 });

// Auto-generate slug from name if not provided
teamMemberSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Optimize JSON output
teamMemberSchema.set("toJSON", { virtuals: false, versionKey: false });
teamMemberSchema.set("toObject", { virtuals: false, versionKey: false });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;


