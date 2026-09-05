import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(
  "/api/v1/auth",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }),
  authRoutes,
);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/crops", cropRoutes);
app.get("/api/v1/health", (req, res) =>
  res.json({ status: "healthy", service: "node-api" }),
);
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);
app.use((error, req, res, next) => {
  console.error(error.message);
  if (error.code === 11000)
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });
  return res
    .status(error.status || 500)
    .json({
      success: false,
      message: error.status ? error.message : "Internal server error",
    });
});
export default app;
