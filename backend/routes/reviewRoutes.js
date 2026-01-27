import express from "express";
import { getReviews, createReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews); // GET http://localhost:5000/reviews
router.post("/", createReview); // POST http://localhost:5000/reviews
router.delete("/:id", deleteReview); // DELETE http://localhost:5000/reviews/id

export default router;