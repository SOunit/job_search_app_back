import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export type CustomError = TypeError & { statusCode: number };

export const handleError = (
  error: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status((error as CustomError).statusCode)
    .json({ error: error.toString() });
};
