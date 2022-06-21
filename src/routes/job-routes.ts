const express = require("express");
const jobController = require("../controllers/job-controller");

const router = express.Router();

router.get("/", jobController.getJobs);
router.get("/:jobId", jobController.getJobById);
router.post("/", jobController.createJob);

export default router;
