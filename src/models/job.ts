import { ObjectId } from "mongodb";
import Skill from "./skill";

export default class Job {
  constructor(
    public title: string,
    public companyName: string,
    public city: string,
    public payment: number,
    public description: string,
    public skills: Skill[] | ObjectId[],
    public userId: string,
    public _id?: ObjectId
  ) {}
}

export type CreateJobPostData = {
  title: string;
  companyName: string;
  city: string;
  payment: number;
  description: string;
  skills: string[];
};
