"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessageService = void 0;
const uuid_1 = require("uuid");
const ticket_message_repository_1 = require("../repositories/ticket-message.repository");
const ticket_repository_1 = require("../repositories/ticket.repository");
const user_repository_1 = require("../repositories/user.repository");
const api_error_1 = require("../errors/api-error");
function toDto(m) {
    return {
        id: m.id,
        ticketId: m.ticketId,
        authorId: m.authorId,
        content: m.content,
        createdAt: m.createdAt,
    };
}
exports.TicketMessageService = {
    getByTicketId: (ticketId) => {
        const ticket = ticket_repository_1.TicketRepository.findById(ticketId);
        if (!ticket)
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Ticket not found");
        return ticket_message_repository_1.TicketMessageRepository.findByTicketId(ticketId).map(toDto);
    },
    create: (ticketId, dto) => {
        const ticket = ticket_repository_1.TicketRepository.findById(ticketId);
        if (!ticket)
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Ticket not found");
        const author = user_repository_1.UserRepository.findById(dto.authorId);
        if (!author)
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Author (user) not found");
        const message = {
            id: (0, uuid_1.v4)(),
            ticketId,
            authorId: dto.authorId,
            content: dto.content,
            createdAt: new Date().toISOString(),
        };
        return toDto(ticket_message_repository_1.TicketMessageRepository.create(message));
    },
    delete: (ticketId, messageId) => {
        const ticket = ticket_repository_1.TicketRepository.findById(ticketId);
        if (!ticket)
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Ticket not found");
        const message = ticket_message_repository_1.TicketMessageRepository.findById(messageId);
        if (!message || message.ticketId !== ticketId) {
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Message not found");
        }
        return ticket_message_repository_1.TicketMessageRepository.delete(messageId);
    },
};
