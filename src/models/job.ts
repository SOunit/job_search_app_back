import { ObjectId } from "mongodb";
import Skill from "./skill";

export default class Job {
  constructor(
    public title: string,
    public companyName: string,
    public city: string,
    public payment: number,
    public description: string,
    public skills: Skill[],
    public _id?: ObjectId
  ) {}
}
