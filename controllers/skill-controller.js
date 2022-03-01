const Skill = require("../models/skill");

const createSkill = async (req, res, next) => {
  const { title } = req.body;

  const skill = new Skill({ title });

  try {
    await skill.save();
  } catch (err) {
    console.log(err);
  }

  res.json({ skill: skill.toObject({ getters: true }) });
};

exports.createSkill = createSkill;
