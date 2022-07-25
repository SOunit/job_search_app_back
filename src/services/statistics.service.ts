import { ObjectId } from "mongodb";
import { SkillsMap } from "../controllers/statisticsController";
import Statistics from "../models/statistics";
import DatabaseService from "./database.service";

const _decrementSubSkillsCount = (
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

const _getStatics = async (
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

const removeSkillsFromStatistics = (skillsMapToRemove: SkillsMap) => {
  try {
    Object.keys(skillsMapToRemove).forEach(async (primarySkillId) => {
      let statistics =
        (await DatabaseService.getInstance().collections.statistics?.findOne({
          "primarySkill._id": new ObjectId(primarySkillId),
        })) as Statistics;

      const updatedStatistics = _decrementSubSkillsCount(
        skillsMapToRemove,
        primarySkillId,
        statistics
      );

      await DatabaseService.getInstance().collections.statistics?.updateOne(
        { "primarySkill._id": new ObjectId(primarySkillId) },
        { $set: updatedStatistics }
      );
    });
  } catch (error) {
    throw error;
  }
};

const addSkillsToStatistics = (skillsMapToAdd: SkillsMap) => {
  try {
    Object.keys(skillsMapToAdd).forEach(async (primarySkillId) => {
      // if data is null, nothing to add
      if (!skillsMapToAdd[primarySkillId]) {
        return;
      }

      const statistics = await _getStatics(primarySkillId, skillsMapToAdd);

      const updatedStatistics = _addSubSkills(
        skillsMapToAdd,
        primarySkillId,
        statistics
      );

      if (updatedStatistics._id) {
        await DatabaseService.getInstance().collections.statistics?.updateOne(
          { _id: new ObjectId(updatedStatistics._id) },
          { $set: updatedStatistics }
        );
      } else {
        await DatabaseService.getInstance().collections.statistics?.insertOne(
          updatedStatistics
        );
      }
    });
  } catch (error) {
    throw error;
  }
};

export const staticsService = {
  removeSkillsFromStatistics,
  addSkillsToStatistics,
};
