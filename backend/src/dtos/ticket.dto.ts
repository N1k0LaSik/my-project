import { TicketPriority } from "../models/ticket.model";

export type CreateTicketRequestDto = {
  subject: string;
  message: string;
  priority: TicketPriority;
  statusId: string;
  authorId: string;
};

export type UpdateTicketRequestDto = {
  subject?: string;
  message?: string;
  priority?: TicketPriority;
  statusId?: string;
};

export type TicketResponseDto = {
  id: string;
  subject: string;
  message: string;
  priority: TicketPriority;
  statusId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};