import Joi from "joi";
import Job from "../models/job";
import { validator } from "./validator";

const jobSchema = Joi.object<Job>({
  title: Joi.string().required(),
  companyName: Joi.string().required(),
  city: Joi.string().required(),
  payment: Joi.number().required(),
  description: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).required(),
  userId: Joi.string().required(),
});

export const validateJob = validator(jobSchema);
