import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { logger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
import { userRoutes } from "./routes/user.routes";
import { statusRoutes } from "./routes/status.routes";
import { ticketRoutes } from "./routes/ticket.routes";
import { ticketMessageRoutes } from "./routes/ticket-message.routes";
import { swaggerDocument } from "./swagger";
import { analyticsRoutes } from "./routes/analytics.routes";
import { exportImportRoutes } from "./routes/export-import.routes";

export const app = express();

// ─── CORS whitelist ───────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin '${origin}' not allowed`), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(express.json());
app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));
app.use(logger);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ─── v1 routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/statuses", statusRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/tickets/:ticketId/messages", ticketMessageRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1", exportImportRoutes);

app.use(errorHandler);