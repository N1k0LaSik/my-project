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
  getByTicketId: async (ticketId: string) => {
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Ticket not found");

    const messages = await TicketMessageRepository.findByTicketId(ticketId);
    return messages.map(toDto);
  },

  create: async (ticketId: string, dto: CreateTicketMessageRequestDto) => {
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Ticket not found");

    const author = await UserRepository.findById(dto.authorId);
    if (!author) throw new ApiError(404, "NOT_FOUND", "Author (user) not found");

    const message: TicketMessage = {
      id: uuid(),
      ticketId,
      authorId: dto.authorId,
      content: dto.content,
      createdAt: new Date().toISOString(),
    };

    return toDto(await TicketMessageRepository.create(message));
  },

  delete: async (ticketId: string, messageId: string) => {
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Ticket not found");

    const message = await TicketMessageRepository.findById(messageId);
    if (!message || message.ticketId !== ticketId) {
      throw new ApiError(404, "NOT_FOUND", "Message not found");
    }

    return TicketMessageRepository.delete(messageId);
  },
};