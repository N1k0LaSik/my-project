import { all, get, run } from "../db/dbClient";
import { Ticket } from "../models/ticket.model";

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
  findAll: async (filters: TicketFilters = {}): Promise<{ items: Ticket[]; total: number }> => {
    const conditions: string[] = ["deletedAt IS NULL"];

    if (filters.statusId) conditions.push(`statusId = '${filters.statusId}'`);
    if (filters.priority) conditions.push(`priority = '${filters.priority}'`);
    if (filters.authorId) conditions.push(`authorId = '${filters.authorId}'`);

    const where = `WHERE ${conditions.join(" AND ")}`;

    const priorityOrder = `CASE priority WHEN 'Low' THEN 1 WHEN 'Medium' THEN 2 WHEN 'High' THEN 3 END`;
    let orderBy = "ORDER BY createdAt DESC";
    if (filters.sortBy) {
      const dir = filters.sortDir === "desc" ? "DESC" : "ASC";
      const col = filters.sortBy === "priority" ? priorityOrder : filters.sortBy;
      orderBy = `ORDER BY ${col} ${dir}`;
    }

    const countRow = await get<{ total: number }>(
      `SELECT COUNT(*) as total FROM Tickets ${where};`
    );
    const total = countRow?.total ?? 0;

    let limitOffset = "";
    if (filters.page !== undefined && filters.pageSize !== undefined) {
      const offset = (filters.page - 1) * filters.pageSize;
      limitOffset = `LIMIT ${filters.pageSize} OFFSET ${offset}`;
    }

    const items = await all<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets ${where} ${orderBy} ${limitOffset};`
    );

    return { items, total };
  },

  findById: (id: string): Promise<Ticket | undefined> => {
    return get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = '${id}' AND deletedAt IS NULL;`
    );
  },

  create: async (ticket: Ticket): Promise<Ticket> => {
    await run(`
      INSERT INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt)
      VALUES (
        '${ticket.id}',
        '${ticket.subject.replace(/'/g, "''")}',
        '${ticket.message.replace(/'/g, "''")}',
        '${ticket.priority}',
        '${ticket.statusId}',
        '${ticket.authorId}',
        '${ticket.createdAt}',
        '${ticket.updatedAt}',
        NULL
      );
    `);
    return (await get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = '${ticket.id}';`
    ))!;
  },

  update: async (id: string, data: Partial<Omit<Ticket, "id" | "createdAt" | "deletedAt">>): Promise<Ticket | null> => {
    const fields: string[] = [];
    if (data.subject !== undefined) fields.push(`subject = '${data.subject.replace(/'/g, "''")}'`);
    if (data.message !== undefined) fields.push(`message = '${data.message.replace(/'/g, "''")}'`);
    if (data.priority !== undefined) fields.push(`priority = '${data.priority}'`);
    if (data.statusId !== undefined) fields.push(`statusId = '${data.statusId}'`);
    if (data.updatedAt !== undefined) fields.push(`updatedAt = '${data.updatedAt}'`);
    if (fields.length === 0) return null;

    const result = await run(`UPDATE Tickets SET ${fields.join(", ")} WHERE id = '${id}' AND deletedAt IS NULL;`);
    if (result.changes === 0) return null;
    return (await get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = '${id}';`
    )) ?? null;
  },

  softDelete: async (id: string): Promise<boolean> => {
    const now = new Date().toISOString();
    const result = await run(
      `UPDATE Tickets SET deletedAt = '${now}' WHERE id = '${id}' AND deletedAt IS NULL;`
    );
    return result.changes > 0;
  },
};