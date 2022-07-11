import Joi from "joi";
import Skill from "../models/skill";
import { validator } from "./validator";

const skillSchema = Joi.object<Skill>({
  title: Joi.string().required(),
  userId: Joi.string().required(),
});

export const validateSkill = validator(skillSchema);
