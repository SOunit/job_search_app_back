const express = require("express");
const skillController = require("../controllers/skill-controller");

const router = express.Router();

router.post("/", skillController.createSkill);

module.exports = router;
