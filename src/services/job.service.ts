import { ObjectId } from "mongodb";
import Job from "../models/job";
import DatabaseService from "./database.service";

const updateJob = () => {};

const getJobById = async (jobId: string) => {
  const query = { _id: new ObjectId(jobId) };

  const pipeLine = [
    { $match: query },
    {
      $lookup: {
        from: "skills",
        localField: "skills",
        foreignField: "_id",
        as: "skills",
      },
    },
  ];

  const jobList = (await DatabaseService.getInstance()
    .collections.jobs?.aggregate(pipeLine)
    .toArray()) as Job[];

  return jobList[0];
};

export const jobService = {
  getJobById,
  updateJob,
};
