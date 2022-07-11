import { NextFunction, Request, Response } from "express";

export type CustomError = TypeError & { statusCode: number };

export const defaultErrorHandler = (
  error: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status((error as CustomError).statusCode || 500)
    .json({ error: error.toString() });
};
