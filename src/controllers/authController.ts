import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middleware/defaultErrorHandler";
import User from "../models/user";
import DatabaseService from "../services/database.service";
import { hash } from "../services/encrypt.service";
import { generateToken } from "../services/token.service";
import {
  getUserByEmail,
  getUserByEmailAndPassword,
} from "../services/user.service";
import { validateSignup } from "../validators/auth.validator";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postData = req.body as User;

    // validate
    const { error } = validateSignup(postData);
    if (error) {
      next(error);
    }

    const { email, password } = postData;

    // check user exist
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // encrypt
    const hashedPassword = await hash(password);
    const newUser = { ...postData, password: hashedPassword };

    // create user
    const result =
      await DatabaseService.getInstance().collections.users?.insertOne(newUser);
    if (!result) {
      return res.status(500).json({ message: "Failed to signup" });
    }

    // generate token
    const userId = result.insertedId.toString();
    const token = generateToken(userId);

    res.status(201).json({ user: { ...newUser, _id: userId }, token });
  } catch (error) {
    (error as CustomError).statusCode = 400;
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    (error as CustomError).statusCode = 400;
    next(error);
  }
};
