import { SkillsMap } from "../controllers/statisticsController";
import Skill from "../models/skill";

export const convertSkillsMapToSkillIdList = (skillsMap: SkillsMap) => {
  const skillIdList: string[] = [];
  Object.keys(skillsMap).forEach((skillId: string) => {
    if (skillsMap[skillId]) {
      skillIdList.push(skillId);
    }
  });
  return skillIdList;
};

export const convertSkillListToMap = (skillList: Skill[]) => {
  const skillsMap: SkillsMap = {};

  skillList.forEach((skill) => {
    if (skill) {
      skillsMap[skill._id!.toString()] = skill;
    }
  });

  return skillsMap;
};
