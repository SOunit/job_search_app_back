import { Request, Response } from "express";
import User from "../models/user";
import DatabaseService from "../services/database.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;

    // FIXME: add user exist check
    // FIXME: add validation

    const result =
      await DatabaseService.getInstance().collections.users?.insertOne(newUser);

    result
      ? res.status(201).json({ ...newUser, _id: result.insertedId })
      : res.status(500).json({ message: "Failed to signup" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
};
