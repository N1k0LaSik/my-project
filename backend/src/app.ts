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

export const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", userRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets/:ticketId/messages", ticketMessageRoutes);

app.use(errorHandler);
