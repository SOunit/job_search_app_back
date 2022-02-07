const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const testSchema = new Schema({
  name: { type: String },
});

// upper case and singular name is convention
module.exports = mongoose.model("Test", testSchema);
