import { Router } from "express";
import * as MessageController from "../controllers/ticket-message.controller";

export const ticketMessageRoutes = Router({ mergeParams: true });

ticketMessageRoutes.get("/", MessageController.getMessages);
ticketMessageRoutes.post("/", MessageController.createMessage);
ticketMessageRoutes.delete("/:messageId", MessageController.deleteMessage);