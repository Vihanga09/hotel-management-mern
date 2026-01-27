import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'rooms', required: true }, 
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true }, // <--- මේ පේළිය අනිවාර්යයෙන්ම තියෙන්න ඕනේ
    phoneNumber: { type: String, required: true },
    checkInDate: { type: String, required: true },
    status: { type: String, default: "Booked" }
}, { timestamps: true });

const Booking = mongoose.model("bookings", bookingSchema);
export default Booking;