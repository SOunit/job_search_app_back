import { Request, Response } from "express";

const Skill = require("../models/skill");

export const getSkills = async (req: Request, res: Response) => {
  let skills;
  try {
    skills = await Skill.find();

    // FIXME: add type to skill
    res.json({
      skills: skills.map((skill: any) => skill.toObject({ getters: true })),
    });
  } catch (err) {
    console.log(err);

    // FIXME
    // add handling error in parent
    // next();
    // const error = new Error("Fetching skills failed. Please try again later");
    // return next(error);
  }

  // mongoose object to plain object
};

export const createSkill = async (req: Request, res: Response) => {
  const { title } = req.body;

  const skill = new Skill({ title });

  try {
    await skill.save();
  } catch (err) {
    console.log(err);
  }

  res.json({ skill: skill.toObject({ getters: true }) });
};
