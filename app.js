const express = require("express");
const mongoose = require("mongoose");
const testRoutes = require("./routes/test-routes");
const cors = require("cors");

const app = express();

app.use(cors());

app.use("/api/tests", testRoutes);

try {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r27pb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
      // process.env.PORT come from Heroku
      app.listen(process.env.PORT || 5000);
    });
} catch (err) {
  console.log(err);
}
