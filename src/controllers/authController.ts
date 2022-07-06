import { Request, Response } from "express";
import User from "../models/user";
import DatabaseService from "../services/database.service";
import { generateToken } from "../services/token.service";
import { getUserByEmailAndPassword } from "../services/user.service";

export const signup = async (req: Request, res: Response) => {
  try {
    // FIXME: add validation
    const newUser = req.body as User;
    const { email, password } = newUser;

    const existingUser = await getUserByEmailAndPassword(email, password);
    if (existingUser) {
      throw new Error("User already exists");
    }

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
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
};
