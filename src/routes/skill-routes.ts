import express from "express";
import {
  createSkill,
  getSkill,
  getSkills,
  updateSkill,
} from "../controllers/skill.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", getSkills);
router.get("/:skillId", getSkill);
router.post("/", authenticateToken, createSkill);
router.patch("/:skillId", authenticateToken, updateSkill);

export default router;
