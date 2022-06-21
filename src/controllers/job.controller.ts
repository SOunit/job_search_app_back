import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Job from "../models/job";
import DatabaseService from "../services/database.service";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = (await DatabaseService.getInstance()
      .collections.jobs?.find({})
      .toArray()) as Job[];

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const query = { _id: new ObjectId(jobId) };

  try {
    const job = (await DatabaseService.getInstance().collections.jobs?.findOne(
      query
    )) as Job;

    res.json({ job });
  } catch (err) {
    res.status(404).json({
      message: `Unable to find matching document with id: ${req.params.id}`,
    });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const newJob = req.body as Job;
    const result =
      await DatabaseService.getInstance().collections.jobs?.insertOne(newJob);

    result
      ? res.status(201).json({
          message: `Successfully created a new job with id ${result.insertedId}`,
        })
      : res.status(500).json({ message: "Failed to create a new job." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: (err as Error).message });
  }
};
