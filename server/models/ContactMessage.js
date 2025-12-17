import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new", index: true },
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Compound index for admin dashboard queries
contactMessageSchema.index({ status: 1, createdAt: -1 });

// Optimize JSON output
contactMessageSchema.set("toJSON", { virtuals: false, versionKey: false });
contactMessageSchema.set("toObject", { virtuals: false, versionKey: false });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;


