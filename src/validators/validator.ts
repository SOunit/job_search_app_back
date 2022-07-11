import Joi from "joi";
import User from "../models/user";

export const validator = (schema: Joi.ObjectSchema<User>) => (payload: User) =>
  schema.validate(payload, { abortEarly: false });
