import express from "express";
import statisticsController from "../controllers/statisticsController";
import { authenticateToken } from "../middleware/authenticateToken";

const statisticsRoutes = express.Router();

statisticsRoutes.post(
  "/",
  authenticateToken,
  statisticsController.addSkillsToStatistics
);
statisticsRoutes.get("/:skillId", statisticsController.getStatisticBySkillId);
statisticsRoutes.post(
  "/delete",
  authenticateToken,
  statisticsController.removeSkills
);
statisticsRoutes.put(
  "/:jobId",
  authenticateToken,
  statisticsController.updateSkills
);

export default statisticsRoutes;
