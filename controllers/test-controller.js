const Test = require("../models/test");

const getTests = async (req, res, next) => {
  let tests;
  try {
    tests = await Test.find();
  } catch (err) {
    console.log(err);

    // FIXME
    // add handling error in parent
    next();
    // const error = new Error("Fetching tests failed. Please try again later");
    // return next(error);
  }

  // mongoose object to plain object
  res.json({ tests: tests.map((test) => test.toObject({ getters: true })) });
};

const createTest = async (req, res, next) => {
  const test = new Test({ name: "test" });
  try {
    await test.save();
  } catch (err) {
    console.log(err);
  }

  res.json({ message: "createTest" });
};

exports.getTests = getTests;
exports.createTest = createTest;
