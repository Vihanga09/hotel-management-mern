import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    color: { type: String, default: "#3b82f6" }
}, { timestamps: true }); // Meken dapu welawa auto record wenawa

const Review = mongoose.model("reviews", reviewSchema);
export default Review;