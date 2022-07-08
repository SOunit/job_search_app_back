import { NextFunction, Request, Response } from "express";
import { getTokenFromAuthHeader, verifyToken } from "../services/token.service";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get token
  const token = getTokenFromAuthHeader(req);
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token is invalid" });
  }

  // get userId from token
  const { userId } = decodedToken;

  console.log("authToken userId", userId);

  // FIXME: add type
  (req as any).userId = userId;

  next();
}
