import Joi from "joi";
import User from "../models/user";
import { validator } from "./validator";

const signupSchema = Joi.object<User>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(15).required(),
});

export const validateSignup = validator(signupSchema);
