import express from "express";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/job.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", getJobs);
router.get("/:jobId", getJobById);
router.post("/", authenticateToken, createJob);
router.delete("/:jobId", authenticateToken, deleteJob);
router.patch("/:jobId", authenticateToken, updateJob);

export default router;
