import { migrate } from "./migrate";
import { run } from "./dbClient";

async function seed() {
  await migrate();

  const now = new Date().toISOString();

  // Users
  await run(`INSERT OR IGNORE INTO Users (id, name, email, createdAt) VALUES ('user-1', 'Alice Johnson', 'alice@example.com', '${now}');`);
  await run(`INSERT OR IGNORE INTO Users (id, name, email, createdAt) VALUES ('user-2', 'Bob Smith', 'bob@example.com', '${now}');`);
  await run(`INSERT OR IGNORE INTO Users (id, name, email, createdAt) VALUES ('user-3', 'Carol White', 'carol@example.com', '${now}');`);

  // Statuses
  await run(`INSERT OR IGNORE INTO Statuses (id, name, color) VALUES ('status-1', 'Open', '#3498db');`);
  await run(`INSERT OR IGNORE INTO Statuses (id, name, color) VALUES ('status-2', 'In Progress', '#f39c12');`);
  await run(`INSERT OR IGNORE INTO Statuses (id, name, color) VALUES ('status-3', 'Resolved', '#2ecc71');`);
  await run(`INSERT OR IGNORE INTO Statuses (id, name, color) VALUES ('status-4', 'Closed', '#95a5a6');`);

  // Tickets
  await run(`INSERT OR IGNORE INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt) VALUES ('ticket-1', 'Cannot login to system', 'I am unable to login since yesterday morning.', 'High', 'status-1', 'user-1', '${now}', '${now}', NULL);`);
  await run(`INSERT OR IGNORE INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt) VALUES ('ticket-2', 'Slow page loading', 'The dashboard takes over 10 seconds to load.', 'Medium', 'status-2', 'user-2', '${now}', '${now}', NULL);`);
  await run(`INSERT OR IGNORE INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt) VALUES ('ticket-3', 'Export to PDF broken', 'PDF export returns empty file.', 'Medium', 'status-1', 'user-1', '${now}', '${now}', NULL);`);
  await run(`INSERT OR IGNORE INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt) VALUES ('ticket-4', 'Wrong email notifications', 'I receive duplicate email notifications.', 'Low', 'status-3', 'user-3', '${now}', '${now}', NULL);`);
  await run(`INSERT OR IGNORE INTO Tickets (id, subject, message, priority, statusId, authorId, createdAt, updatedAt, deletedAt) VALUES ('ticket-5', 'Mobile app crash', 'App crashes on startup on iOS 17.', 'High', 'status-2', 'user-2', '${now}', '${now}', NULL);`);

  // TicketMessages
  await run(`INSERT OR IGNORE INTO TicketMessages (id, ticketId, authorId, content, createdAt) VALUES ('msg-1', 'ticket-1', 'user-2', 'Can you provide your username?', '${now}');`);
  await run(`INSERT OR IGNORE INTO TicketMessages (id, ticketId, authorId, content, createdAt) VALUES ('msg-2', 'ticket-1', 'user-1', 'My username is alice@example.com', '${now}');`);
  await run(`INSERT OR IGNORE INTO TicketMessages (id, ticketId, authorId, content, createdAt) VALUES ('msg-3', 'ticket-2', 'user-3', 'We are investigating the issue.', '${now}');`);
  await run(`INSERT OR IGNORE INTO TicketMessages (id, ticketId, authorId, content, createdAt) VALUES ('msg-4', 'ticket-5', 'user-2', 'Which iPhone model are you using?', '${now}');`);

  console.log("Seed completed successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});