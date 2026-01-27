import express from "express";
import { addBooking, getAllBookings, deleteBooking, updateBooking, getBookingsByUser,getBookingStats // Import the new stats function
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Route for admin summary statistics (Revenue & Total count)
// Note: Put this ABOVE /:id routes to avoid route conflict
bookingRouter.get("/stats/summary", getBookingStats);

// Standard CRUD operations
bookingRouter.post("/", addBooking);         // Create a new booking
bookingRouter.get("/", getAllBookings);      // Get all bookings (Admin)
bookingRouter.delete("/:id", deleteBooking); // Cancel/Delete a booking
bookingRouter.put("/:id", updateBooking);    // Update booking details

// Get bookings for a specific logged-in user
bookingRouter.get("/user/:userId", getBookingsByUser); 

export default bookingRouter;