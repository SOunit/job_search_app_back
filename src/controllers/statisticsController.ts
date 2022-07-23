import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { CustomError } from "../middleware/defaultErrorHandler";
import Skill from "../models/skill";
import Statistics from "../models/statistics";
import DatabaseService from "../services/database.service";

type SkillsMap = {
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
    const skillsMapToAdd = req.body;

    Object.keys(skillsMapToAdd).forEach(async (primarySkillId) => {
      const statisticsWithPrimaryKey = await _createStaticsWithPrimaryKey(
        primarySkillId,
        skillsMapToAdd
      );

      console.log("statisticsWithPrimaryKey", statisticsWithPrimaryKey);

      const subSkillUpdatedStatistics = _addSubSkills(
        skillsMapToAdd,
        primarySkillId,
        statisticsWithPrimaryKey
      );

      console.log("subSkillUpdatedStatistics", subSkillUpdatedStatistics);

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

    res.json({ message: "statistics updated!" });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

const _removeSubSkills = (
  skillsMapToRemove: SkillsMap,
  primarySkillId: string,
  statistics: Statistics
) => {
  try {
    Object.keys(skillsMapToRemove).forEach((subSkillId) => {
      if (subSkillId === primarySkillId) {
        return;
      }

      statistics.subSkillsMap[subSkillId].count--;
      if (statistics.subSkillsMap[subSkillId].count < 0) {
        statistics.subSkillsMap[subSkillId].count = 0;
      }
    });

    return statistics;
  } catch (error) {
    throw error;
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

const removeSkills = (req: Request, res: Response, next: NextFunction) => {
  try {
    const skillsMapToRemove = req.body;

    Object.keys(skillsMapToRemove).forEach(async (primarySkillId) => {
      let statistics =
        (await DatabaseService.getInstance().collections.statistics?.findOne({
          "primarySkill._id": new ObjectId(primarySkillId),
        })) as Statistics;

      const subSKillsUpdatedStatistics = _removeSubSkills(
        skillsMapToRemove,
        primarySkillId,
        statistics
      );

      DatabaseService.getInstance().collections.statistics?.updateOne(
        { "primarySkill._id": new ObjectId(primarySkillId) },
        { $set: subSKillsUpdatedStatistics }
      );
    });

    res.json({ message: "skills removed" });
  } catch (error) {
    (error as CustomError).statusCode = 500;
    next(error);
  }
};

export default { addSkillsToStatistics, getStatisticBySkillId, removeSkills };
