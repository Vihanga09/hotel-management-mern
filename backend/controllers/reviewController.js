import Review from "../Model/Review.js";

// 1. සියලුම රිවීව්ස් ලබාගැනීම
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }); // අලුත්ම ඒවා උඩට
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. අලුත් රිවීව් එකක් සේව් කිරීම
export const createReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. රිවීව් එකක් මකා දැමීම (Admin සඳහා)
export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Review Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};