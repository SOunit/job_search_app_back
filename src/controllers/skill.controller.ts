import { Request, Response } from "express";
import Skill from "../models/skill";
import DatabaseService from "../services/database.service";

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = (await DatabaseService.getInstance()
      .collections.skills?.find({})
      .toArray()) as Skill[];

    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const newSkill = req.body as Skill;
    const result =
      await DatabaseService.getInstance().collections.skills?.insertOne(
        newSkill
      );

    result
      ? res.status(201).json({
          ...newSkill,
          _id: result.insertedId,
        })
      : res.status(500).json({ message: "Failed to create a new skill." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: (err as Error).message });
  }
};
