import { NextFunction, Request, Response } from "express";
import { getTokenFromAuthHeader, verifyToken } from "../services/token.service";
import { CustomError } from "./defaultErrorHandler";

export type AuthorizedRequest = Request & { userId: string };

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get token
  const token = getTokenFromAuthHeader(req);
  if (!token) {
    const error = new Error("No token found");
    (error as CustomError).statusCode = 401;
    return next(error);
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    const error = new Error("Token is invalid");
    (error as CustomError).statusCode = 401;
    return next(error);
  }

  // get userId from token
  const { userId } = decodedToken;

  (req as AuthorizedRequest).userId = userId;

  next();
}
