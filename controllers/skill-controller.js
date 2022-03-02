const Skill = require("../models/skill");

const getSkills = async (req, res, next) => {
  let skills;
  try {
    skills = await Skill.find();
  } catch (err) {
    console.log(err);

    // FIXME
    // add handling error in parent
    next();
    // const error = new Error("Fetching skills failed. Please try again later");
    // return next(error);
  }

  // mongoose object to plain object
  res.json({
    skills: skills.map((skill) => skill.toObject({ getters: true })),
  });
};

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

exports.getSkills = getSkills;
exports.createSkill = createSkill;
