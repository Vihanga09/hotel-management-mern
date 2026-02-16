import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import roomRouter from './routes/roomRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import reviewRouter from './routes/reviewRoutes.js';
import authRouter from './routes/AuthRouter.js';
import chatRouter from './routes/chatRoutes.js';

const app = express();

// fix cors
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); 

const connectionString = "mongodb+srv://admin:123@cluster0.pkaokiv.mongodb.net/hotelDB?retryWrites=true&w=majority";

mongoose.connect(connectionString).then(() => {
    console.log("Database connected ✅");
}).catch((err) => {
    console.log("Database connection failed ❌", err);
});

//conets routes
app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/api/auth", authRouter);

//chatbot route
app.use("/api/chatbot", chatRouter); 

app.listen(5000, () => {
    console.log("Server is started on port 5000 🚀");
});