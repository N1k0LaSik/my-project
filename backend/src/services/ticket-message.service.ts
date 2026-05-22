import { v4 as uuid } from "uuid";
import { TicketMessageRepository } from "../repositories/ticket-message.repository";
import { TicketRepository } from "../repositories/ticket.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreateTicketMessageRequestDto, TicketMessageResponseDto } from "../dtos/ticket-message.dto";
import { ApiError } from "../errors/api-error";
import { TicketMessage } from "../models/ticket-message.model";

function toDto(m: TicketMessage): TicketMessageResponseDto {
  return {
    id: m.id,
    ticketId: m.ticketId,
    authorId: m.authorId,
    content: m.content,
    createdAt: m.createdAt,
  };
}

export const TicketMessageService = {
  getByTicketId: (ticketId: string) => {
    const ticket = TicketRepository.findById(ticketId);
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Ticket not found");

    return TicketMessageRepository.findByTicketId(ticketId).map(toDto);
  },

  create: (ticketId: string, dto: CreateTicketMessageRequestDto) => {
    const ticket = TicketRepository.findById(ticketId);
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Ticket not found");

    const author = UserRepository.findById(dto.authorId);
    if (!author) throw new ApiError(404, "NOT_FOUND", "Author (user) not found");

    const message: TicketMessage = {
      id: uuid(),
      ticketId,
      authorId: dto.authorId,
      content: dto.content,
      createdAt: new Date().toISOString(),
    };

    return toDto(TicketMessageRepository.create(message));
  },

  delete: (ticketId: string, messageId: string) => {
    const ticket = TicketRepository.findById(ticketId);
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Ticket not found");

    const message = TicketMessageRepository.findById(messageId);
    if (!message || message.ticketId !== ticketId) {
      throw new ApiError(404, "NOT_FOUND", "Message not found");
    }

    return TicketMessageRepository.delete(messageId);
  },
};