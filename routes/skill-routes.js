const express = require("express");
const skillController = require("../controllers/skill-controller");

const router = express.Router();

// GET & http://localhost:5000/api/skills
router.get("/", skillController.getSkills);

// POST & http://localhost:5000/api/skills
router.post("/", skillController.createSkill);

module.exports = router;
