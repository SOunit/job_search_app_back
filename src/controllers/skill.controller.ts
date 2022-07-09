import { Request, Response } from "express";
import { ObjectId } from "mongodb";
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

export const getSkill = async (req: Request, res: Response) => {
  try {
    const skillId = req.params.skillId;
    const skill =
      (await DatabaseService.getInstance().collections.skills?.findOne({
        _id: new ObjectId(skillId),
      })) as Skill;

    res.json({ skill });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    // get userId from token
    // FIXME: add type
    const userId = (req as any).userId;

    // create new skill
    const newSkill = { ...(req.body as Skill), userId };
    const result =
      await DatabaseService.getInstance().collections.skills?.insertOne(
        newSkill
      );

    // create response
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

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const updatedSkill = req.body as Skill;
    const { skillId } = req.params;
    const userId = (req as any).userId;

    console.log("userId", userId);

    const result =
      await DatabaseService.getInstance().collections.skills?.updateOne(
        {
          _id: new ObjectId(skillId),
          userId,
        },
        { $set: updatedSkill }
      );

    if (!result) {
      res.status(500).json({ message: "Failed to update skill." });
    }

    if (result?.matchedCount === 0) {
      res
        .status(500)
        .json({ message: "Failed to update skill. No match skill found!" });
    }

    res.json({ _id: skillId, ...updatedSkill });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: (err as Error).message });
  }
};
