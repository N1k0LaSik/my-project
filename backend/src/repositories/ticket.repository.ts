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

// Allowlist для сортування — параметри не працюють для назв колонок
const ALLOWED_SORT_COLUMNS = new Set(["createdAt", "updatedAt", "subject", "priority"]);

export const TicketRepository = {
  findAll: async (filters: TicketFilters = {}): Promise<{ items: Ticket[]; total: number }> => {
    const conditions: string[] = ["deletedAt IS NULL"];
    const params: unknown[] = [];

    if (filters.statusId) {
      conditions.push("statusId = ?");
      params.push(filters.statusId);
    }
    if (filters.priority) {
      conditions.push("priority = ?");
      params.push(filters.priority);
    }
    if (filters.authorId) {
      conditions.push("authorId = ?");
      params.push(filters.authorId);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;

    const priorityOrder = `CASE priority WHEN 'Low' THEN 1 WHEN 'Medium' THEN 2 WHEN 'High' THEN 3 END`;
    let orderBy = "ORDER BY createdAt DESC";
    if (filters.sortBy && ALLOWED_SORT_COLUMNS.has(filters.sortBy)) {
      const dir = filters.sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      const col = filters.sortBy === "priority" ? priorityOrder : filters.sortBy;
      orderBy = `ORDER BY ${col} ${dir}`;
    }

    const countRow = await get<{ total: number }>(
      `SELECT COUNT(*) as total FROM Tickets ${where};`,
      params
    );
    const total = countRow?.total ?? 0;

    const paginationParams: unknown[] = [];
    let limitOffset = "";
    if (filters.page !== undefined && filters.pageSize !== undefined) {
      const offset = (filters.page - 1) * filters.pageSize;
      limitOffset = "LIMIT ? OFFSET ?";
      paginationParams.push(filters.pageSize, offset);
    }

    const items = await all<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets ${where} ${orderBy} ${limitOffset};`,
      [...params, ...paginationParams]
    );

    return { items, total };
  },

  findById: (id: string): Promise<Ticket | undefined> => {
    return get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = ? AND deletedAt IS NULL;`,
      [id]
    );
  },

  findByIdAndOwner: (id: string, ownerUserId: string): Promise<Ticket | undefined> => {
    return get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = ? AND authorId = ? AND deletedAt IS NULL;`,
      [id, ownerUserId]
    );
  },

  create: async (ticket: Ticket): Promise<Ticket> => {
    await run(
      `INSERT INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL);`,
      [ticket.id, ticket.subject, ticket.message, ticket.priority, ticket.statusId, ticket.authorId, ticket.createdAt, ticket.updatedAt]
    );
    return (await get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = ?;`,
      [ticket.id]
    ))!;
  },

  update: async (id: string, data: Partial<Omit<Ticket, "id" | "createdAt" | "deletedAt">>): Promise<Ticket | null> => {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (data.subject !== undefined) { fields.push("subject = ?"); params.push(data.subject); }
    if (data.message !== undefined) { fields.push("message = ?"); params.push(data.message); }
    if (data.priority !== undefined) { fields.push("priority = ?"); params.push(data.priority); }
    if (data.statusId !== undefined) { fields.push("statusId = ?"); params.push(data.statusId); }
    if (data.updatedAt !== undefined) { fields.push("updatedAt = ?"); params.push(data.updatedAt); }
    if (fields.length === 0) return null;

    params.push(id);
    const result = await run(
      `UPDATE Tickets SET ${fields.join(", ")} WHERE id = ? AND deletedAt IS NULL;`,
      params
    );
    if (result.changes === 0) return null;
    return (await get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = ?;`,
      [id]
    )) ?? null;
  },

  updateByOwner: async (id: string, ownerUserId: string, data: Partial<Omit<Ticket, "id" | "createdAt" | "deletedAt">>): Promise<Ticket | null> => {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (data.subject !== undefined) { fields.push("subject = ?"); params.push(data.subject); }
    if (data.message !== undefined) { fields.push("message = ?"); params.push(data.message); }
    if (data.priority !== undefined) { fields.push("priority = ?"); params.push(data.priority); }
    if (data.statusId !== undefined) { fields.push("statusId = ?"); params.push(data.statusId); }
    if (data.updatedAt !== undefined) { fields.push("updatedAt = ?"); params.push(data.updatedAt); }
    if (fields.length === 0) return null;

    params.push(id, ownerUserId);
    const result = await run(
      `UPDATE Tickets SET ${fields.join(", ")} WHERE id = ? AND authorId = ? AND deletedAt IS NULL;`,
      params
    );
    if (result.changes === 0) return null;
    return (await get<Ticket>(
      `SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt
       FROM Tickets WHERE id = ?;`,
      [id]
    )) ?? null;
  },

  softDelete: async (id: string): Promise<boolean> => {
    const now = new Date().toISOString();
    const result = await run(
      `UPDATE Tickets SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL;`,
      [now, id]
    );
    return result.changes > 0;
  },

  softDeleteByOwner: async (id: string, ownerUserId: string): Promise<boolean> => {
    const now = new Date().toISOString();
    const result = await run(
      `UPDATE Tickets SET deletedAt = ? WHERE id = ? AND authorId = ? AND deletedAt IS NULL;`,
      [now, id, ownerUserId]
    );
    return result.changes > 0;
  },
};