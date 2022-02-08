const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: { type: String },
  skills: [{ id: { type: String }, title: { type: String } }],
});

// upper case and singular name is convention
module.exports = mongoose.model("Job", jobSchema);
