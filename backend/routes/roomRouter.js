import express from "express";
import { getRooms, addRoom, getRoomById, deleteRoom, updateRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.get("/", getRooms);           // Okkoma rooms
roomRouter.post("/", addRoom);          // Room ekak add karanna
roomRouter.get("/:id", getRoomById);    // Specific room ekak ganna
roomRouter.delete("/:id", deleteRoom);  // Room ekak ain karanna
roomRouter.put("/:id", updateRoom);     // Room details wenas karanna

export default roomRouter;