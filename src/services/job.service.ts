import { ObjectId } from "mongodb";
import Job, { JobPostData } from "../models/job";
import DatabaseService from "./database.service";

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

const wrapSkillsWithObjectId = (job: JobPostData) => {
  const skills = job.skills.map((skill) => new ObjectId(skill));
  const newJob = { ...job, skills } as Job;
  return newJob;
};

const convertJobToInsert = (job: JobPostData, userId: string) => {
  const newJob = wrapSkillsWithObjectId(job);
  console.log("convertJobToInsert", newJob);

  return { ...newJob, userId };
};

export const jobService = {
  getJobById,
  convertJobToInsert,
};
