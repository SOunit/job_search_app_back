import express from "express";
import { signup } from "../controllers/authController";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

export default authRoutes;
