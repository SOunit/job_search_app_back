import { Request, Response } from "express";

const Job = require("../models/job");

export const getJobs = async (req: Request, res: Response) => {
  let jobs;
  try {
    jobs = await Job.find();
  } catch (err) {
    console.log(err);
  }

  // FIXME: add type to job
  // mongoose object to plain object
  res.json({ jobs: jobs.map((job: any) => job.toObject({ getters: true })) });
};

export const getJobById = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;

  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
  }

  // mongoose object to plain object
  res.json({ job: job.toObject({ getters: true }) });
};

export const createJob = async (req: Request, res: Response) => {
  const { title, companyName, city, payment, description } = req.body;

  const job = new Job({
    title: title,
    skills: [],
    companyName,
    city,
    payment,
    description,
  });

  try {
    await job.save();
  } catch (err) {
    console.log(err);
  }

  res.json({ job: job.toObject({ getters: true }) });
};
