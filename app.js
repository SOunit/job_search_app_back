const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
  res.send("hi");
});

// process.env.PORT come from Heroku
app.listen(process.env.PORT || 5000);
