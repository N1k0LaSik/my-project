"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicket = exports.createTicket = exports.getTicketById = exports.getTickets = void 0;
const ticket_service_1 = require("../services/ticket.service");
const ticket_validator_1 = require("../validators/ticket.validator");
const api_error_1 = require("../errors/api-error");
const getTickets = (req, res) => {
    const { statusId, priority, authorId, sortBy, sortDir } = req.query;
    const page = req.query.page ? parseInt(String(req.query.page)) : undefined;
    const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : undefined;
    const result = ticket_service_1.TicketService.getAll({
        statusId: statusId,
        priority: priority,
        authorId: authorId,
        sortBy: sortBy,
        sortDir: sortDir,
        page,
        pageSize,
    });
    return res.status(200).json(result);
};
exports.getTickets = getTickets;
const getTicketById = (req, res, next) => {
    const ticket = ticket_service_1.TicketService.getById(String(req.params.id));
    if (!ticket)
        return next(new api_error_1.ApiError(404, "NOT_FOUND", "Ticket not found"));
    return res.status(200).json(ticket);
};
exports.getTicketById = getTicketById;
const createTicket = (req, res, next) => {
    try {
        const dto = (0, ticket_validator_1.validateCreateTicketDto)(req.body);
        const ticket = ticket_service_1.TicketService.create(dto);
        return res.status(201).json(ticket);
    }
    catch (err) {
        return next(err);
    }
};
exports.createTicket = createTicket;
const updateTicket = (req, res, next) => {
    try {
        const dto = (0, ticket_validator_1.validateUpdateTicketDto)(req.body);
        const ticket = ticket_service_1.TicketService.update(String(req.params.id), dto);
        if (!ticket)
            return next(new api_error_1.ApiError(404, "NOT_FOUND", "Ticket not found"));
        return res.status(200).json(ticket);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateTicket = updateTicket;
const deleteTicket = (req, res, next) => {
    const deleted = ticket_service_1.TicketService.delete(String(req.params.id));
    if (!deleted)
        return next(new api_error_1.ApiError(404, "NOT_FOUND", "Ticket not found"));
    return res.status(204).send();
};
exports.deleteTicket = deleteTicket;
console.log("CREATE TICKET HIT");
