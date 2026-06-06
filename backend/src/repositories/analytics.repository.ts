import { all } from "../db/dbClient";

export type TicketWithDetails = {
  id: string;
  subject: string;
  message: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  statusId: string;
  statusName: string;
  statusColor: string;
};

export type StatusCount = {
  statusId: string;
  statusName: string;
  count: number;
};

export const AnalyticsRepository = {
  findTicketsWithDetails: (search?: string): Promise<TicketWithDetails[]> => {
    if (search) {
      return all<TicketWithDetails>(
        `SELECT
          t.id, t.subject, t.message, t.priority, t.createdAt, t.updatedAt,
          u.id AS authorId, u.name AS authorName, u.email AS authorEmail,
          s.id AS statusId, s.name AS statusName, s.color AS statusColor
         FROM Tickets t
         JOIN Users u ON u.id = t.authorId
         JOIN Statuses s ON s.id = t.statusId
         WHERE t.deletedAt IS NULL AND t.subject LIKE ?
         ORDER BY t.createdAt DESC;`,
        [`%${search}%`]
      );
    }

    return all<TicketWithDetails>(
      `SELECT
        t.id, t.subject, t.message, t.priority, t.createdAt, t.updatedAt,
        u.id AS authorId, u.name AS authorName, u.email AS authorEmail,
        s.id AS statusId, s.name AS statusName, s.color AS statusColor
       FROM Tickets t
       JOIN Users u ON u.id = t.authorId
       JOIN Statuses s ON s.id = t.statusId
       WHERE t.deletedAt IS NULL
       ORDER BY t.createdAt DESC;`
    );
  },

  countTicketsByStatus: (): Promise<StatusCount[]> => {
    return all<StatusCount>(
      `SELECT
        s.id AS statusId, s.name AS statusName, COUNT(t.id) AS count
       FROM Statuses s
       LEFT JOIN Tickets t ON t.statusId = s.id AND t.deletedAt IS NULL
       GROUP BY s.id, s.name
       ORDER BY count DESC;`
    );
  },
};