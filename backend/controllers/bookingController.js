import Booking from "../Model/booking.js";
import Room from "../Model/room.js";
import nodemailer from 'nodemailer';

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendConfirmationEmail = async (bookingData, roomName) => {
    const mailOptions = {
        from: '"Grand Horizon Hotel" <${process.env.EMAIL_USER}>',
        to: bookingData.email, 
        subject: 'Booking Confirmed - Grand Horizon Hotel ✅',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                    <h1>Booking Confirmed!</h1>
                </div>
                <div style="padding: 20px; color: #333;">
                    <p>Dear <b>${bookingData.customerName}</b>,</p>
                    <p>Your reservation is successful!</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p><b>Room:</b> ${roomName}</p>
                    <p><b>Check-in Date:</b> ${new Date(bookingData.checkInDate).toLocaleDateString()}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p>Thank you for choosing Grand Horizon!</p>
                </div>
            </div>
        `
    };

    try {
        console.log("Attempting to send email to:", bookingData.email);
        await transporter.sendMail(mailOptions);
        console.log("✅ Confirmation email sent successfully to:", bookingData.email);
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
    }
};

// 1. Add Booking (Fixed logic to extract email properly)
export const addBooking = async (req, res) => {
    try {
        console.log("--- New Booking Request ---");
        
        // Destructure directly from req.body to avoid Mongoose model filtering issues
        const { roomId, email, customerName, checkInDate } = req.body; 
        console.log("Extracted Email:", email); 

        const newBooking = new Booking(req.body);
        await newBooking.save();

        const room = await Room.findByIdAndUpdate(roomId, { isAvailable: false }, { new: true });

        // If email was provided in the request, send notification
        if (email) {
            console.log("Email detected. Starting process...");
            // Passing individual fields to avoid issues with the saved object structure
            await sendConfirmationEmail({ email, customerName, checkInDate }, room?.name || "Standard Room");
        } else {
            console.log("⚠️ No email address found in req.body. Email skipped.");
        }

        res.status(201).json({ message: "Booking Success! ✅", data: newBooking });
    } catch (err) {
        console.error("Booking Controller Error:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// 2. All Bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Delete Booking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const roomId = booking.roomId;
        await Booking.findByIdAndDelete(req.params.id);
        await Room.findByIdAndUpdate(roomId, { isAvailable: true });

        res.status(200).json({ message: "Booking Deleted! 🗑️" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Update Booking
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Booking.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Booking not found!" });
        res.status(200).json({ message: "Booking Updated!", data: updated });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 5. User Specific Bookings
export const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId: userId }).populate('roomId'); 
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Admin Stats
export const getBookingStats = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.roomId?.price || 0), 0);
        res.status(200).json({ totalBookings, totalRevenue });
    } catch (err) {
        res.status(500).json({ message: "Error calculating stats", error: err.message });
    }
};