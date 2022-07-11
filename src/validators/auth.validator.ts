import Joi from "joi";
import { LoginData } from "../controllers/authController";
import User from "../models/user";
import { validator } from "./validator";

const signupSchema = Joi.object<User>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(15).required(),
});
export const validateSignup = validator(signupSchema);

const loginSchema = Joi.object<LoginData>({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(15).required(),
});
export const validateLogin = validator(loginSchema);
