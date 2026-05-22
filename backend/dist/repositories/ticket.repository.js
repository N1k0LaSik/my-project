"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRepository = void 0;
const tickets = [];
exports.TicketRepository = {
    findAll: (filters = {}) => {
        let result = tickets.filter(t => t.deletedAt === null);
        // Фільтрація
        if (filters.statusId) {
            result = result.filter(t => t.statusId === filters.statusId);
        }
        if (filters.priority) {
            result = result.filter(t => t.priority === filters.priority);
        }
        if (filters.authorId) {
            result = result.filter(t => t.authorId === filters.authorId);
        }
        // Сортування
        if (filters.sortBy) {
            const dir = filters.sortDir === "desc" ? -1 : 1;
            result = [...result].sort((a, b) => {
                const aVal = a[filters.sortBy];
                const bVal = b[filters.sortBy];
                return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
            });
        }
        const total = result.length;
        // Пагінація
        if (filters.page !== undefined && filters.pageSize !== undefined) {
            const start = (filters.page - 1) * filters.pageSize;
            result = result.slice(start, start + filters.pageSize);
        }
        return { items: result, total };
    },
    findById: (id) => tickets.find(t => t.id === id && t.deletedAt === null),
    create: (ticket) => {
        tickets.push(ticket);
        return ticket;
    },
    update: (id, data) => {
        const ticket = tickets.find(t => t.id === id && t.deletedAt === null);
        if (!ticket)
            return null;
        Object.assign(ticket, data);
        return ticket;
    },
    // Soft delete
    softDelete: (id) => {
        const ticket = tickets.find(t => t.id === id && t.deletedAt === null);
        if (!ticket)
            return false;
        ticket.deletedAt = new Date().toISOString();
        return true;
    },
};
