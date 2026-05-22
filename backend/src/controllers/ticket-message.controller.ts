import { NextFunction, Request, Response } from "express";
import { TicketMessageService } from "../services/ticket-message.service";
import { validateCreateTicketMessageDto } from "../validators/ticket-message.validator";

export const getMessages = (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = TicketMessageService.getByTicketId(String(req.params.ticketId));
    return res.status(200).json({ items, total: items.length });
  } catch (err) {
    return next(err);
  }
};

export const createMessage = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateTicketMessageDto(req.body);
    const message = TicketMessageService.create(String(req.params.ticketId), dto);
    return res.status(201).json(message);
  } catch (err) {
    return next(err);
  }
};

export const deleteMessage = (req: Request, res: Response, next: NextFunction) => {
  try {
    TicketMessageService.delete(String(req.params.ticketId), String(req.params.messageId));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};