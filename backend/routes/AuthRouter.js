import express from "express";
import { register, login } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register); // POST: /api/auth/register
authRouter.post("/login", login);       // POST: /api/auth/login

export default authRouter;