"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessageRepository = void 0;
const messages = [];
exports.TicketMessageRepository = {
    findByTicketId: (ticketId) => messages.filter(m => m.ticketId === ticketId),
    findById: (id) => messages.find(m => m.id === id),
    create: (message) => {
        messages.push(message);
        return message;
    },
    delete: (id) => {
        const index = messages.findIndex(m => m.id === id);
        if (index === -1)
            return false;
        messages.splice(index, 1);
        return true;
    },
};
