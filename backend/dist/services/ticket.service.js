"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const uuid_1 = require("uuid");
const ticket_repository_1 = require("../repositories/ticket.repository");
const api_error_1 = require("../errors/api-error");
const user_repository_1 = require("../repositories/user.repository");
const status_repository_1 = require("../repositories/status.repository");
function toDto(t) {
    return {
        id: t.id,
        subject: t.subject,
        message: t.message,
        priority: t.priority,
        statusId: t.statusId,
        authorId: t.authorId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
    };
}
exports.TicketService = {
    getAll: (filters) => {
        const { items, total } = ticket_repository_1.TicketRepository.findAll(filters);
        return { items: items.map(toDto), total };
    },
    getById: (id) => {
        const ticket = ticket_repository_1.TicketRepository.findById(id);
        if (!ticket)
            return null;
        return toDto(ticket);
    },
    create: (dto) => {
        const author = user_repository_1.UserRepository.findById(dto.authorId);
        if (!author)
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Author (user) not found");
        const status = status_repository_1.StatusRepository.findById(dto.statusId);
        if (!status)
            throw new api_error_1.ApiError(404, "NOT_FOUND", "Status not found");
        const now = new Date().toISOString();
        const ticket = {
            id: (0, uuid_1.v4)(),
            ...dto,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };
        return toDto(ticket_repository_1.TicketRepository.create(ticket));
    },
    update: (id, dto) => {
        if (dto.statusId) {
            const status = status_repository_1.StatusRepository.findById(dto.statusId);
            if (!status)
                throw new api_error_1.ApiError(404, "NOT_FOUND", "Status not found");
        }
        const updated = ticket_repository_1.TicketRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString(),
        });
        if (!updated)
            return null;
        return toDto(updated);
    },
    delete: (id) => ticket_repository_1.TicketRepository.softDelete(id),
};
