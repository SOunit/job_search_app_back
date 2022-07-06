import { ObjectId } from "mongodb";

export default class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public _id?: ObjectId
  ) {}
}
