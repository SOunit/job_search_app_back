import { ObjectId } from "mongodb";
import { SkillsMap } from "../controllers/statisticsController";
import Statistics from "../models/statistics";
import DatabaseService from "./database.service";

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

const removeSkillsFromStatistics = (skillsMapToRemove: SkillsMap) => {
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

    await DatabaseService.getInstance().collections.statistics?.updateOne(
      { "primarySkill._id": new ObjectId(primarySkillId) },
      { $set: subSKillsUpdatedStatistics }
    );
  });
};

export const staticsService = { removeSkillsFromStatistics };
