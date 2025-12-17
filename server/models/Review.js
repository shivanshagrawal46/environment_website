import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: true, trim: true },
    reviewerName: { type: String, required: true, trim: true },
    reviewerCompany: { type: String, trim: true },
    tagName: { type: String, trim: true },
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

reviewSchema.set("toJSON", { virtuals: false, versionKey: false });
reviewSchema.set("toObject", { virtuals: false, versionKey: false });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

