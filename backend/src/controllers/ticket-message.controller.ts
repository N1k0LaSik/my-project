import { NextFunction, Request, Response } from "express";
import { TicketMessageService } from "../services/ticket-message.service";
import { validateCreateTicketMessageDto } from "../validators/ticket-message.validator";

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await TicketMessageService.getByTicketId(String(req.params.ticketId));
    return res.status(200).json({ items, total: items.length });
  } catch (err) {
    return next(err);
  }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateTicketMessageDto(req.body);
    const message = await TicketMessageService.create(String(req.params.ticketId), dto);
    return res.status(201).json(message);
  } catch (err) {
    return next(err);
  }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await TicketMessageService.delete(String(req.params.ticketId), String(req.params.messageId));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};