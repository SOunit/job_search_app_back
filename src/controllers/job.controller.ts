import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Job, { CreateJobPostData } from "../models/job";
import DatabaseService from "../services/database.service";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = (await DatabaseService.getInstance()
      .collections.jobs?.aggregate([
        {
          $lookup: {
            // join table name = skills collection
            from: "skills",
            // local field = jobs.skills
            localField: "skills",
            // foreignField = skills._id
            foreignField: "_id",
            // as is necessary for lookup, overwrite if same field name
            as: "skills",
          },
        },
      ])
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
    const userId = (req as any).userId as string;
    const createJobPostData = req.body as CreateJobPostData;
    const skills = createJobPostData.skills.map((skill) => new ObjectId(skill));
    const newJob = { ...createJobPostData, skills, userId } as Job;

    // add validation
    // check if all props exists

    const result =
      await DatabaseService.getInstance().collections.jobs?.insertOne(newJob);

    if (!result) {
      return res.status(500).json({ message: "Failed to create a new job." });
    }

    res.status(201).json({
      _id: result.insertedId,
      ...newJob,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: (err as Error).message });
  }
};
