import express from "express";
import jobRoutes from "./routes/job-routes";
import skillRoutes from "./routes/skill-routes";
import cors from "cors";
import DatabaseService from "./services/database.service";
import authRoutes from "./routes/authRoutes";
import { defaultErrorHandler } from "./middleware/defaultErrorHandler";
import statisticsRoutes from "./routes/statisticsRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/statistics", statisticsRoutes);

// The default error handler
// http://expressjs.com/en/guide/error-handling.html#error-handling
app.use(defaultErrorHandler);

try {
  DatabaseService.getInstance()
    .connectToDatabase()
    .then(() => {
      // process.env.PORT come from Heroku
      app.listen(PORT, () => {
        console.log(`listen on ${PORT}`);
      });
    });
} catch (err) {
  console.log(err);
}
