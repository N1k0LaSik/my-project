"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.createMessage = exports.getMessages = void 0;
const ticket_message_service_1 = require("../services/ticket-message.service");
const ticket_message_validator_1 = require("../validators/ticket-message.validator");
const getMessages = (req, res, next) => {
    try {
        const items = ticket_message_service_1.TicketMessageService.getByTicketId(String(req.params.ticketId));
        return res.status(200).json({ items, total: items.length });
    }
    catch (err) {
        return next(err);
    }
};
exports.getMessages = getMessages;
const createMessage = (req, res, next) => {
    try {
        const dto = (0, ticket_message_validator_1.validateCreateTicketMessageDto)(req.body);
        const message = ticket_message_service_1.TicketMessageService.create(String(req.params.ticketId), dto);
        return res.status(201).json(message);
    }
    catch (err) {
        return next(err);
    }
};
exports.createMessage = createMessage;
const deleteMessage = (req, res, next) => {
    try {
        ticket_message_service_1.TicketMessageService.delete(String(req.params.ticketId), String(req.params.messageId));
        return res.status(204).send();
    }
    catch (err) {
        return next(err);
    }
};
exports.deleteMessage = deleteMessage;
