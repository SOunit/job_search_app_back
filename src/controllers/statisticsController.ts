import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { CustomError } from "../middleware/defaultErrorHandler";
import Skill from "../models/skill";
import Statistics from "../models/statistics";
import DatabaseService from "../services/database.service";
import { jobService } from "../services/job.service";
import { staticsService } from "../services/statistics.service";
import {
  convertSkillListToMap,
  convertSkillsMapToSkillIdList,
} from "../utils/utils";

export type SkillsMap = {
  [key: string]: Skill;
};

const addSkillsToStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skillsMapToAdd: SkillsMap = req.body;

    staticsService.addSkillsToStatistics(skillsMapToAdd);

    const skillIdList = convertSkillsMapToSkillIdList(skillsMapToAdd);

    res.json({ skillIdList });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

const getStatisticBySkillId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skillId = req?.params?.skillId;

    const statistics =
      (await DatabaseService.getInstance().collections.statistics?.findOne({
        "primarySkill._id": new ObjectId(skillId),
      })) as Statistics;

    res.json({ statistics });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

const removeSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skillsMapToRemove: SkillsMap = req.body;

    staticsService.removeSkillsFromStatistics(skillsMapToRemove);

    res.json({ message: "skills removed" });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

const updateSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    const skillsMapToAdd: SkillsMap = req.body;

    const job = await jobService.getJobById(jobId);
    const skills = job.skills;

    const skillsMapToRemove = convertSkillListToMap(skills as Skill[]);

    staticsService.removeSkillsFromStatistics(skillsMapToRemove);
    staticsService.addSkillsToStatistics(skillsMapToAdd);

    const skillIdListToAdd = convertSkillsMapToSkillIdList(skillsMapToAdd);
    const skillIdListToRemove =
      convertSkillsMapToSkillIdList(skillsMapToRemove);

    res.json([...skillIdListToAdd, ...skillIdListToRemove]);
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

export default {
  addSkillsToStatistics,
  getStatisticBySkillId,
  removeSkills,
  updateSkills,
};
