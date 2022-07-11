import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import DatabaseService from "../services/database.service";
import { hash } from "../services/encrypt.service";
import { generateToken } from "../services/token.service";
import {
  getUserByEmail,
  getUserByEmailAndPassword,
} from "../services/user.service";
import { CustomError } from "./errorController";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // FIXME: add validation
    const postData = req.body as User;
    const { email, password } = postData;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(password);
    const newUser = { ...postData, password: hashedPassword };

    const result =
      await DatabaseService.getInstance().collections.users?.insertOne(newUser);

    if (!result) {
      return res.status(500).json({ message: "Failed to signup" });
    }

    const userId = result.insertedId.toString();

    // generate token
    const token = generateToken(userId);

    res.status(201).json({ user: { ...newUser, _id: userId }, token });
  } catch (error) {
    (error as CustomError).statusCode = 400;
    next(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // FIXME: add validation
    const { email, password } = req.body as { email: string; password: string };

    const loginUser = await getUserByEmailAndPassword(email, password);
    if (!loginUser) {
      throw new Error("User not exists");
    }

    // generate token
    const token = generateToken(loginUser._id.toString());

    res.status(201).json({ user: loginUser, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
};
