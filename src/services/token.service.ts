import { Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants/constants";

type Token = {
  userId: string;
};

export const generateToken = (userId: string) => {
  if (!userId) {
    return null;
  }

  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "1h" });
};

export const getTokenFromAuthHeader = (req: Request) => {
  // Bearer TOKEN
  const authHeader = req.headers["authorization"];

  // token = undefined or token
  const token = authHeader && authHeader.split(" ")[1];

  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded as Token;
  } catch (error) {
    return false;
  }
};
