CREATE TABLE IF NOT EXISTS Tickets (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  statusId TEXT NOT NULL,
  authorId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  deletedAt TEXT,
  FOREIGN KEY (statusId) REFERENCES Statuses(id) ON DELETE RESTRICT,
  FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE RESTRICT
);