import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { CustomError } from "../middleware/defaultErrorHandler";
import Skill from "../models/skill";
import Statistics from "../models/statistics";
import DatabaseService from "../services/database.service";
import { jobService } from "../services/job.service";
import { staticsService } from "../services/statistics.service";
import { convertSkillsMapToSkillIdList } from "../utils/utils";

export type SkillsMap = {
  [key: string]: Skill;
};

const _createStaticsWithPrimaryKey = async (
  primarySkillId: string,
  skillsMapToAdd: SkillsMap
) => {
  try {
    // create primary key
    let statistics =
      (await DatabaseService.getInstance().collections.statistics?.findOne({
        "primarySkill._id": new ObjectId(primarySkillId),
      })) as Statistics;

    const primarySkill = skillsMapToAdd[primarySkillId];

    if (!statistics) {
      statistics = {
        primarySkill: { ...primarySkill, _id: new ObjectId(primarySkill._id) },
        subSkillsMap: {},
      };
    }

    return statistics;
  } catch (error) {
    throw error;
  }
};

const _addSubSkills = (
  skillsMapToAdd: SkillsMap,
  primarySkillId: string,
  statistics: Statistics
) => {
  try {
    // create sub skills
    Object.keys(skillsMapToAdd).forEach((subSkillId) => {
      if (subSkillId === primarySkillId) {
        return;
      }

      if (statistics.subSkillsMap[subSkillId]) {
        statistics.subSkillsMap[subSkillId].count++;
      } else {
        statistics.subSkillsMap[subSkillId] = {
          count: 1,
          skill: skillsMapToAdd[subSkillId],
        };
      }
    });

    return statistics;
  } catch (error) {
    throw error;
  }
};

const addSkillsToStatistics = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skillsMapToAdd: SkillsMap = req.body;

    Object.keys(skillsMapToAdd).forEach(async (primarySkillId) => {
      const statisticsWithPrimaryKey = await _createStaticsWithPrimaryKey(
        primarySkillId,
        skillsMapToAdd
      );

      const subSkillUpdatedStatistics = _addSubSkills(
        skillsMapToAdd,
        primarySkillId,
        statisticsWithPrimaryKey
      );

      if (subSkillUpdatedStatistics._id) {
        await DatabaseService.getInstance().collections.statistics?.updateOne(
          { _id: new ObjectId(subSkillUpdatedStatistics._id) },
          { $set: subSkillUpdatedStatistics }
        );
      } else {
        await DatabaseService.getInstance().collections.statistics?.insertOne(
          subSkillUpdatedStatistics
        );
      }
    });

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

    await staticsService.removeSkillsFromStatistics(skillsMapToRemove);

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

    const job = await jobService.getJobById(jobId);
    const skills = job.skills;

    res.json(skills);
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
