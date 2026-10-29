import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import ambassadorRoutes from "./routes/ambassadorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import copilotRoutes from "./routes/copilotRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NxtWave AI Growth Engine API is running",
  });
});

app.use("/api/ambassadors", ambassadorRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/ambassadors", ambassadorRoutes);
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});