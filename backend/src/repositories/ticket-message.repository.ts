import { TicketMessage } from "../models/ticket-message.model";

const messages: TicketMessage[] = [];

export const TicketMessageRepository = {
  findByTicketId: (ticketId: string) =>
    messages.filter(m => m.ticketId === ticketId),

  findById: (id: string) => messages.find(m => m.id === id),

  create: (message: TicketMessage) => {
    messages.push(message);
    return message;
  },

  delete: (id: string) => {
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return false;
    messages.splice(index, 1);
    return true;
  },
};