import express from "express";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
} from "../controllers/job.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", getJobs);
router.get("/:jobId", getJobById);
router.post("/", authenticateToken, createJob);
router.delete("/:jobId", authenticateToken, deleteJob);

export default router;
