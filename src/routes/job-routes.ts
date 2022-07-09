import express from "express";
import { createJob, getJobById, getJobs } from "../controllers/job.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", getJobs);
router.get("/:jobId", getJobById);
router.post("/", authenticateToken, createJob);

export default router;
