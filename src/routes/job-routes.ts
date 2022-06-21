import express from "express";
import { createJob, getJobById, getJobs } from "../controllers/job.controller";

const router = express.Router();

router.get("/", getJobs);
router.get("/:jobId", getJobById);
router.post("/", createJob);

export default router;
