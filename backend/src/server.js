import express from "express";
import cors from "cors";
import expressRateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { startBirthdayWisherJob } from "./jobs/index.js";

const app = express();

// CORS — allow frontend dev server
app.use(cors({ origin: true, credentials: true }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = expressRateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

(async () => {
  startBirthdayWisherJob();
})();

// Serve uploaded employee images
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api", routes);

app.listen(3000, () => console.log("Server running on port 3000"));
