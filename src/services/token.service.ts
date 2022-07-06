import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants/constants";

export const generateToken = (userId: string) => {
  if (!userId) {
    return null;
  }

  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "1h" });
};
