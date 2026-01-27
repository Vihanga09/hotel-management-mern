import Room from "../Model/room.js";

// 1. Okkoma rooms list eka ganna
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Aluth room ekak add karanna
export const addRoom = async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).json({ message: "Room added successfully!", data: newRoom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. Ekama eka room ekaka details ganna (ID eka use karala)
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ message: "Invalid room ID" });
    }
};

// 4. Room ekak delete karanna
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({ message: "Room deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Room ekaka details update karanna
export const updateRoom = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({ message: "Room updated successfully!", data: updatedRoom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};