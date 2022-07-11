import Joi from "joi";
import { LoginData } from "../controllers/authController";
import Job from "../models/job";
import Skill from "../models/skill";
import User from "../models/user";

type SchemaTypes = User | LoginData | Skill | Job;

export const validator =
  (schema: Joi.ObjectSchema<SchemaTypes>) => (payload: SchemaTypes) =>
    schema.validate(payload, { abortEarly: false });
