const express = require("express");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/job-routes");
const skillRoutes = require("./routes/skill-routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);

try {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r27pb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
      // process.env.PORT come from Heroku
      app.listen(PORT, () => {
        console.log(`listen on ${PORT}`);
      });
    });
} catch (err) {
  console.log(err);
}
