import { ObjectId } from "mongodb";
import { SkillsMap } from "../controllers/statisticsController";
import Statistics from "../models/statistics";
import { convertSkillsMapToSkillIdList } from "../utils/utils";
import DatabaseService from "./database.service";

const _decrementSubSkillsCount = (
  skillsMapToRemove: SkillsMap,
  primarySkillId: string,
  statistics: Statistics
): Statistics => {
  try {
    const decrementedStatistics = { ...statistics };
    Object.keys(skillsMapToRemove).forEach((subSkillId) => {
      if (subSkillId === primarySkillId) {
        return;
      }

      decrementedStatistics.subSkillsMap[subSkillId].count--;
      if (decrementedStatistics.subSkillsMap[subSkillId].count < 0) {
        decrementedStatistics.subSkillsMap[subSkillId].count = 0;
      }
    });

    return decrementedStatistics;
  } catch (error) {
    throw error;
  }
};

const _getStaticsByPrimarySkillId = async (
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

const _incrementSubSkills = (
  skillsMapToAdd: SkillsMap,
  primarySkillId: string,
  statistics: Statistics
): Statistics => {
  try {
    const updatedStatistics = { ...statistics };

    // create sub skills
    Object.keys(skillsMapToAdd).forEach((subSkillId) => {
      const isSameSkillId = subSkillId === primarySkillId;
      const isSkillSelected = skillsMapToAdd[subSkillId];
      const isSkillsAreCoupled =
        skillsMapToAdd[subSkillId] && skillsMapToAdd[primarySkillId];

      if (isSameSkillId || !isSkillSelected || !isSkillsAreCoupled) {
        return;
      }

      if (updatedStatistics.subSkillsMap[subSkillId]) {
        updatedStatistics.subSkillsMap[subSkillId].count++;
      } else {
        updatedStatistics.subSkillsMap[subSkillId] = {
          count: 1,
          skill: skillsMapToAdd[subSkillId],
        };
      }
    });

    return updatedStatistics;
  } catch (error) {
    throw error;
  }
};

const _upsertStatistics = async (updatedStatistics: Statistics) => {
  // FIXME: use `upsert` from mongodb
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

      const statistics = await _getStaticsByPrimarySkillId(
        primarySkillId,
        skillsMapToAdd
      );

      const updatedStatistics = _incrementSubSkills(
        skillsMapToAdd,
        primarySkillId,
        statistics
      );

      await _upsertStatistics(updatedStatistics);
    });
  } catch (error) {
    throw error;
  }
};

const updateStatistics = (
  skillsMapToRemove: SkillsMap,
  skillsMapToAdd: SkillsMap
) => {
  try {
    // fetch statistics
    const skillsMapToFetch = { ...skillsMapToAdd, ...skillsMapToRemove };

    Object.keys(skillsMapToFetch).forEach(async (key) => {
      const statistics = await _getStaticsByPrimarySkillId(
        key,
        skillsMapToFetch
      );

      // decrement statistics
      const decrementedStatistics = _decrementSubSkillsCount(
        skillsMapToRemove,
        key,
        statistics
      );

      // increment statistics
      const incrementedStatistics = _incrementSubSkills(
        skillsMapToAdd,
        key,
        decrementedStatistics
      );

      // update statistics
      await _upsertStatistics(incrementedStatistics);
    });

    const skillIdList = convertSkillsMapToSkillIdList(skillsMapToFetch);
    return skillIdList;
  } catch (error) {
    throw error;
  }
};

export const staticsService = {
  removeSkillsFromStatistics,
  addSkillsToStatistics,
  updateStatistics,
};
