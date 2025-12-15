import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import workoutsRoutes from "./routes/workouts.js";
import externalRoutes from "./routes/external.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Mongo connected");
} catch (err) {
  console.error("Mongo connection error:", err);
  process.exit(1);
}



const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true); 
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/workouts", workoutsRoutes);

app.use("/api/external", externalRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const port = process.env.PORT || 8080;
app.listen(port,"0.0.0.0", () => console.log(`Server running on http://localhost:${port}`));
