import { NextFunction, Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import { validateCreateTicketDto, validateUpdateTicketDto } from "../validators/ticket.validator";
import { ApiError } from "../errors/api-error";

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { statusId, priority, authorId, sortBy, sortDir } = req.query;
    const page = req.query.page ? parseInt(String(req.query.page)) : undefined;
    const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : undefined;

    const result = await TicketService.getAll({
      statusId: statusId as string | undefined,
      priority: priority as string | undefined,
      authorId: authorId as string | undefined,
      sortBy: sortBy as "createdAt" | "updatedAt" | "subject" | "priority" | undefined,
      sortDir: sortDir as "asc" | "desc" | undefined,
      page,
      pageSize,
    });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await TicketService.getById(String(req.params.id));
    if (!ticket) return next(new ApiError(404, "NOT_FOUND", "Ticket not found"));
    return res.status(200).json(ticket);
  } catch (err) {
    return next(err);
  }
};

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateTicketDto(req.body);
    // Власник береться з req.user (встановлений demoAuth), не з тіла запиту
    const authorId = req.user!.id;
    const ticket = await TicketService.create({ ...dto, authorId });
    return res.status(201).json(ticket);
  } catch (err) {
    return next(err);
  }
};

export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateTicketDto(req.body);
    const ownerUserId = req.user!.id;
    // updateByOwner повертає null якщо тікет не існує АБО належить іншому користувачу
    const ticket = await TicketService.updateByOwner(String(req.params.id), ownerUserId, dto);
    if (!ticket) return next(new ApiError(404, "NOT_FOUND", "Ticket not found or access denied"));
    return res.status(200).json(ticket);
  } catch (err) {
    return next(err);
  }
};

export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerUserId = req.user!.id;
    // deleteByOwner повертає false якщо тікет не існує АБО належить іншому користувачу
    const deleted = await TicketService.deleteByOwner(String(req.params.id), ownerUserId);
    if (!deleted) return next(new ApiError(404, "NOT_FOUND", "Ticket not found or access denied"));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};