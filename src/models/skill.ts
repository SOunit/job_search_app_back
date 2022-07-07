import { ObjectId } from "mongodb";

export default class Skill {
  constructor(
    public title: string,
    public userId: string,
    public _id?: ObjectId
  ) {}
}
