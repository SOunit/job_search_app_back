import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { AuthorizedRequest } from "../middleware/authenticateToken";
import { CustomError } from "../middleware/defaultErrorHandler";
import Skill from "../models/skill";
import DatabaseService from "../services/database.service";
import { validateSkill } from "../validators/skill.validator";

export const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skills = (await DatabaseService.getInstance()
      .collections.skills?.find({})
      .toArray()) as Skill[];

    res.json({ skills });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

export const getSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skillId = req.params.skillId;
    const skill =
      (await DatabaseService.getInstance().collections.skills?.findOne({
        _id: new ObjectId(skillId),
      })) as Skill;

    res.json({ skill });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

export const createSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get userId from token
    const userId = (req as AuthorizedRequest).userId;

    // validate
    const newSkill = { ...(req.body as Skill), userId };
    const { error } = validateSkill(newSkill);
    if (error) {
      next(error);
    }

    // create new skill
    const result =
      await DatabaseService.getInstance().collections.skills?.insertOne(
        newSkill
      );

    if (!result) {
      const error = new Error("Failed to create a new skill.");
      (error as CustomError).statusCode = 500;
      return next(error);
    }

    res.status(201).json({
      ...newSkill,
      _id: result.insertedId,
    });
  } catch (error) {
    (error as CustomError).statusCode = 400;
    next(error);
  }
};

export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedSkill = req.body as Skill;
    const { skillId } = req.params;
    const userId = (req as any).userId;

    const result =
      await DatabaseService.getInstance().collections.skills?.updateOne(
        {
          _id: new ObjectId(skillId),
          userId,
        },
        { $set: updatedSkill }
      );

    if (!result) {
      const error = new Error("Failed to update skill.");
      (error as CustomError).statusCode = 500;
      return next(error);
    }

    if (result?.matchedCount === 0) {
      const error = new Error("Failed to update skill. No match skill found!");
      (error as CustomError).statusCode = 500;
      return next(error);
    }

    res.json({ _id: skillId, ...updatedSkill });
  } catch (error) {
    (error as CustomError).statusCode = 400;
    next(error);
  }
};
