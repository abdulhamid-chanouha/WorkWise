import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import projectsRoutes from "./modules/projects/projects.routes";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    status: 429,
    message: "Too many authentication attempts. Please try again later.",
    details: null,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use("/", healthRoutes);
app.use("/auth", authLimiter, authRoutes);
app.use("/api/projects", projectsRoutes);

app.use(errorHandler);

export default app;
