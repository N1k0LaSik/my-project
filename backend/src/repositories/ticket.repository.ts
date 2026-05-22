import { Ticket } from "../models/ticket.model";

const tickets: Ticket[] = [];

export type TicketFilters = {
  statusId?: string;
  priority?: string;
  authorId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Pick<Ticket, "createdAt" | "updatedAt" | "subject" | "priority">;
  sortDir?: "asc" | "desc";
};

export const TicketRepository = {
  findAll: (filters: TicketFilters = {}) => {
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
      const priorityOrder: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

      result = [...result].sort((a, b) => {
          if (filters.sortBy === "priority") {
              const aVal = priorityOrder[a.priority] ?? 0;
              const bVal = priorityOrder[b.priority] ?? 0;
              return (aVal - bVal) * dir;
          }
          const aVal = a[filters.sortBy!];
          const bVal = b[filters.sortBy!];
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

  findById: (id: string) =>
    tickets.find(t => t.id === id && t.deletedAt === null),

  create: (ticket: Ticket) => {
    tickets.push(ticket);
    return ticket;
  },

  update: (id: string, data: Partial<Omit<Ticket, "id" | "createdAt" | "deletedAt">>) => {
    const ticket = tickets.find(t => t.id === id && t.deletedAt === null);
    if (!ticket) return null;
    Object.assign(ticket, data);
    return ticket;
  },

  // Soft delete
  softDelete: (id: string) => {
      const ticket = tickets.find(t => t.id === id && t.deletedAt === null);
      if (!ticket) return false;
      ticket.deletedAt = new Date().toISOString();
      return true;
  },
};
