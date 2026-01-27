import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER (අලුත් Users ලා සහ Admin ලා ඇතුළත් කිරීම) ---
export const register = async (req, res) => {
    try {
        // Password එක Encrypt කිරීම (Hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // අලුත් User Object එක සෑදීම
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin || false // මෙතනින් තමයි Admin ද නැද්ද කියලා තීරණය වෙන්නේ
        });

        // Database එකේ Save කිරීම
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        // Email එක කලින් පාවිච්චි කරලා නම් එන Error එක handle කිරීම
        if (err.code === 11000) {
            return res.status(400).json("Email already exists!");
        }
        res.status(500).json(err);
    }
};

// --- LOGIN (Login වී JWT Token එකක් ලබා ගැනීම) ---
export const login = async (req, res) => {
    try {
        // User ඉන්නවාදැයි බැලීම
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found!");

        // Password එක පරීක්ෂා කිරීම
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Wrong password!");

        // Token එකක් සෑදීම (SecretKey එක පස්සේ .env එකට දාමු)
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            "SecretKey123", 
            { expiresIn: "1d" }
        );

        // Password එක නැතිව ඉතිරි දත්ත සහ Token එක යැවීම
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json(err);
    }
};