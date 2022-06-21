import express from "express";
import { createSkill, getSkills } from "../controllers/skill.controller";

const router = express.Router();

router.get("/", getSkills);
router.post("/", createSkill);

export default router;
