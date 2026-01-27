import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import roomRouter from './routes/roomRouter.js'; // Aluth router eka import karanna
import bookingRouter from './routes/bookingRouter.js';
import reviewRouter from './routes/reviewRoutes.js';
import authRouter from './routes/AuthRouter.js';


const app = express();
app.use(cors()); // CORS enable karanna

app.use(express.json()); // Meka onema wenawa JSON data read karanna

const connectionString = "mongodb+srv://admin:123@cluster0.pkaokiv.mongodb.net/hotelDB?retryWrites=true&w=majority";

mongoose.connect(connectionString).then(() => {
    console.log("Database connected ✅");
}).catch((err) => {
    console.log("Database connection failed ❌", err);
});

// Routes connect kirima
app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/api/auth", authRouter);

app.listen(5000, () => {
    console.log("Server is started on port 5000 🚀");
});