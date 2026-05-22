import { NextFunction, Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import { validateCreateTicketDto, validateUpdateTicketDto } from "../validators/ticket.validator";
import { ApiError } from "../errors/api-error";

export const getTickets = (req: Request, res: Response) => {
  const { statusId, priority, authorId, sortBy, sortDir } = req.query;

  const page = req.query.page ? parseInt(String(req.query.page)) : undefined;
  const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : undefined;

  const result = TicketService.getAll({
    statusId: statusId as string | undefined,
    priority: priority as string | undefined,
    authorId: authorId as string | undefined,
    sortBy: sortBy as "createdAt" | "updatedAt" | "subject" | "priority" | undefined,
    sortDir: sortDir as "asc" | "desc" | undefined,
    page,
    pageSize,
  });

  return res.status(200).json(result);
};

export const getTicketById = (req: Request, res: Response, next: NextFunction) => {
  const ticket = TicketService.getById(String(req.params.id));
  if (!ticket) return next(new ApiError(404, "NOT_FOUND", "Ticket not found"));
  return res.status(200).json(ticket);
};

export const createTicket = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateTicketDto(req.body);
    const ticket = TicketService.create(dto);
    return res.status(201).json(ticket);
  } catch (err) {
    console.error("CREATE TICKET ERROR:", err);
    return next(err);
  }
};

export const updateTicket = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateTicketDto(req.body);
    const ticket = TicketService.update(String(req.params.id), dto);
    if (!ticket) return next(new ApiError(404, "NOT_FOUND", "Ticket not found"));
    return res.status(200).json(ticket);
  } catch (err) {
    return next(err);
  }
};

export const deleteTicket = (req: Request, res: Response, next: NextFunction) => {
  const deleted = TicketService.delete(String(req.params.id));
  if (!deleted) return next(new ApiError(404, "NOT_FOUND", "Ticket not found"));
  return res.status(204).send();
};
