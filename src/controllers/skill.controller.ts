import { Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import Skill from "../models/skill";
import DatabaseService from "../services/database.service";
import { getTokenFromAuthHeader, verifyToken } from "../services/token.service";

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
    const token = getTokenFromAuthHeader(req);
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const { userId } = decodedToken;

    const newSkill = { ...(req.body as Skill), userId };
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
