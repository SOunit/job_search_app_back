const express = require("express");
const jobController = require("../controllers/job-controller");

const router = express.Router();

router.get("/", jobController.getJobs);
router.post("/", jobController.createJob);

module.exports = router;
