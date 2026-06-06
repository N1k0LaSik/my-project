import { all, get, run } from "../db/dbClient";
import { TicketMessage } from "../models/ticket-message.model";

export const TicketMessageRepository = {
  findByTicketId: (ticketId: string): Promise<TicketMessage[]> => {
    return all<TicketMessage>(
      `SELECT id, ticketId, authorId, content, createdAt
       FROM TicketMessages WHERE ticketId = ? ORDER BY createdAt ASC;`,
      [ticketId]
    );
  },

  findById: (id: string): Promise<TicketMessage | undefined> => {
    return get<TicketMessage>(
      `SELECT id, ticketId, authorId, content, createdAt
       FROM TicketMessages WHERE id = ?;`,
      [id]
    );
  },

  create: async (message: TicketMessage): Promise<TicketMessage> => {
    await run(
      `INSERT INTO TicketMessages (id, ticketId, authorId, content, createdAt)
       VALUES (?, ?, ?, ?, ?);`,
      [message.id, message.ticketId, message.authorId, message.content, message.createdAt]
    );
    return (await get<TicketMessage>(
      `SELECT id, ticketId, authorId, content, createdAt
       FROM TicketMessages WHERE id = ?;`,
      [message.id]
    ))!;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await run(
      `DELETE FROM TicketMessages WHERE id = ?;`,
      [id]
    );
    return result.changes > 0;
  },
};