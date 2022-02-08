const Job = require("../models/job");

const getJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await Job.find();
  } catch (err) {
    console.log(err);

    // FIXME
    // add handling error in parent
    next();
    // const error = new Error("Fetching Jobs failed. Please try again later");
    // return next(error);
  }

  // mongoose object to plain object
  res.json({ jobs: jobs.map((job) => job.toObject({ getters: true })) });
};

const createJob = async (req, res, next) => {
  const { title } = req.body;

  const job = new Job({ title: title, skills: [] });

  try {
    await job.save();
  } catch (err) {
    console.log(err);
  }

  res.json({ job: job.toObject({ getters: true }) });
};

exports.getJobs = getJobs;
exports.createJob = createJob;
