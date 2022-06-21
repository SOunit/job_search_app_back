const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  title: { type: String },
});

// upper case and singular name is convention
module.exports = mongoose.model("Skill", skillSchema);
