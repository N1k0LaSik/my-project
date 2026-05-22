export type TicketPriority = "Low" | "Medium" | "High";

export type Ticket = {
  id: string;
  subject: string;
  message: string;
  priority: TicketPriority;
  statusId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};