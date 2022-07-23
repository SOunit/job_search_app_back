import { SkillsMap } from "../controllers/statisticsController";

export const convertSkillsMapToSkillIdList = (skillsMap: SkillsMap) => {
  const skillIdList: string[] = [];
  Object.keys(skillsMap).forEach((skillId: string) => {
    skillIdList.push(skillId);
  });
  return skillIdList;
};
