import Joi from "joi";
import { LoginData } from "../controllers/authController";
import User from "../models/user";

type SchemaTypes = User | LoginData;

export const validator =
  (schema: Joi.ObjectSchema<SchemaTypes>) => (payload: SchemaTypes) =>
    schema.validate(payload, { abortEarly: false });
