import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "https://via.placeholder.com/150" },
    
    isAvailable: { type: Boolean, default: true } 
}, { timestamps: true });

const Room = mongoose.model("rooms", roomSchema);
export default Room;