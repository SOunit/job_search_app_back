import { ObjectId } from "mongodb";

export default class Skill {
  constructor(public title: string, public _id?: ObjectId) {}
}
