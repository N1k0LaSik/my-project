import { Router } from "express";
import * as TicketController from "../controllers/ticket.controller";


export const ticketRoutes = Router();

ticketRoutes.get("/", TicketController.getTickets);
ticketRoutes.get("/:id", TicketController.getTicketById);
ticketRoutes.post("/", TicketController.createTicket);
ticketRoutes.put("/:id", TicketController.updateTicket);
ticketRoutes.patch("/:id", TicketController.updateTicket);
ticketRoutes.delete("/:id", TicketController.deleteTicket);

