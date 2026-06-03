import express from "express";
import expressRateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import {
  startBirthdayWisherJob,
} from "./jobs/index.js";

const app = express();

// Rate limiting
const limiter = expressRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

(async () => {
  startBirthdayWisherJob(); // cron job
})();

// Routes
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api", routes);

app.listen(3000, () => console.log("Scheduler running on port 3000"));
