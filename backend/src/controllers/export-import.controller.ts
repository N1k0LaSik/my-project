import { NextFunction, Request, Response } from "express";
import { all, run, get } from "../db/dbClient";
import { v4 as uuid } from "uuid";

type TicketExport = {
  id: string;
  subject: string;
  message: string;
  priority: string;
  statusId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
  }[];
};

export const exportTickets = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await all<Omit<TicketExport, "messages">>(`
      SELECT id, subject, message, priority, statusId, authorId, createdAt, updatedAt
      FROM Tickets WHERE deletedAt IS NULL ORDER BY createdAt ASC;
    `);

    const result: TicketExport[] = [];

    for (const ticket of tickets) {
      const messages = await all<TicketExport["messages"][0]>(`
        SELECT id, authorId, content, createdAt
        FROM TicketMessages WHERE ticketId = '${ticket.id}' ORDER BY createdAt ASC;
      `);
      result.push({ ...ticket, messages });
    }

    res.setHeader("Content-Disposition", "attachment; filename=tickets-export.json");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ exportedAt: new Date().toISOString(), total: result.length, tickets: result });
  } catch (err) {
    return next(err);
  }
};

export const importTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tickets } = req.body;

    if (!Array.isArray(tickets)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "tickets must be an array" } });
    }

    let importedTickets = 0;
    let importedMessages = 0;
    const errors: string[] = [];

    for (const ticket of tickets) {
      if (!ticket.subject || !ticket.message || !ticket.priority || !ticket.statusId || !ticket.authorId) {
        errors.push(`Skipped ticket "${ticket.subject ?? "unknown"}": missing required fields`);
        continue;
      }

      const statusExists = await get(`SELECT id FROM Statuses WHERE id = '${ticket.statusId}';`);
      if (!statusExists) {
        errors.push(`Skipped ticket "${ticket.subject}": statusId "${ticket.statusId}" not found`);
        continue;
      }

      const authorExists = await get(`SELECT id FROM Users WHERE id = '${ticket.authorId}';`);
      if (!authorExists) {
        errors.push(`Skipped ticket "${ticket.subject}": authorId "${ticket.authorId}" not found`);
        continue;
      }

      const now = new Date().toISOString();
      const newTicketId = uuid();

      await run(`
        INSERT INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt)
        VALUES (
          '${newTicketId}',
          '${String(ticket.subject).replace(/'/g, "''")}',
          '${String(ticket.message).replace(/'/g, "''")}',
          '${ticket.priority}',
          '${ticket.statusId}',
          '${ticket.authorId}',
          '${now}',
          '${now}',
          NULL
        );
      `);
      importedTickets++;

      if (Array.isArray(ticket.messages)) {
        for (const msg of ticket.messages) {
          if (!msg.content || !msg.authorId) continue;

          const msgAuthorExists = await get(`SELECT id FROM Users WHERE id = '${msg.authorId}';`);
          if (!msgAuthorExists) continue;

          await run(`
            INSERT INTO TicketMessages (id, ticketId, authorId, content, createdAt)
            VALUES (
              '${uuid()}',
              '${newTicketId}',
              '${msg.authorId}',
              '${String(msg.content).replace(/'/g, "''")}',
              '${now}'
            );
          `);
          importedMessages++;
        }
      }
    }

    return res.status(200).json({
      imported: { tickets: importedTickets, messages: importedMessages },
      skipped: errors.length,
      errors,
    });
  } catch (err) {
    return next(err);
  }
};