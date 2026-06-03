CREATE INDEX IF NOT EXISTS idx_tickets_statusId ON Tickets(statusId);
CREATE INDEX IF NOT EXISTS idx_tickets_authorId ON Tickets(authorId);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticketId ON TicketMessages(ticketId);