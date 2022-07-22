import { ObjectId } from "mongodb";
import Skill from "./skill";

export default class Statistics {
  constructor(
    public primarySkill: Skill,
    public subSkillsMap: SubSkillsMap,
    public _id?: ObjectId
  ) {}
}

type SubSkillsMap = {
  [key: string]: {
    skill: Skill;
    count: number;
  };
};
