import express from "express";
import {
  createSkill,
  getSkill,
  getSkills,
} from "../controllers/skill.controller";

const router = express.Router();

router.get("/", getSkills);
router.get("/:skillId", getSkill);
router.post("/", createSkill);

export default router;
