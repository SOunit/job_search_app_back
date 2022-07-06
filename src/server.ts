import express from "express";
import jobRoutes from "./routes/job-routes";
import skillRoutes from "./routes/skill-routes";
import cors from "cors";
import DatabaseService from "./services/database.service";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/auth", authRoutes);

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
