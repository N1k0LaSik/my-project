import { Router } from "express";
import * as TicketController from "../controllers/ticket.controller";
import { demoAuth } from "../middleware/demo-auth.middleware";

export const ticketRoutes = Router();

// GET — публічне читання, без авторизації
ticketRoutes.get("/", TicketController.getTickets);
ticketRoutes.get("/:id", TicketController.getTicketById);

// POST/PUT/PATCH/DELETE — потребують X-Demo-UserId
// demoAuth встановлює req.user, контролер бере authorId звідти
ticketRoutes.post("/", demoAuth, TicketController.createTicket);
ticketRoutes.put("/:id", demoAuth, TicketController.updateTicket);
ticketRoutes.patch("/:id", demoAuth, TicketController.updateTicket);
ticketRoutes.delete("/:id", demoAuth, TicketController.deleteTicket);