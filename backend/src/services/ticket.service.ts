import { v4 as uuid } from "uuid";
import { TicketRepository, TicketFilters } from "../repositories/ticket.repository";
import { CreateTicketRequestDto, UpdateTicketRequestDto, TicketResponseDto } from "../dtos/ticket.dto";
import { ApiError } from "../errors/api-error";
import { UserRepository } from "../repositories/user.repository";
import { StatusRepository } from "../repositories/status.repository";
import { Ticket } from "../models/ticket.model";

function toDto(t: Ticket): TicketResponseDto {
  return {
    id: t.id,
    subject: t.subject,
    message: t.message,
    priority: t.priority,
    statusId: t.statusId,
    authorId: t.authorId,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export const TicketService = {
  getAll: async (filters: TicketFilters) => {
    const { items, total } = await TicketRepository.findAll(filters);
    return { items: items.map(toDto), total };
  },

  getById: async (id: string) => {
    const ticket = await TicketRepository.findById(id);
    if (!ticket) return null;
    return toDto(ticket);
  },

  create: async (dto: CreateTicketRequestDto) => {
    const author = await UserRepository.findById(dto.authorId);
    if (!author) throw new ApiError(404, "NOT_FOUND", "Author (user) not found");

    const status = await StatusRepository.findById(dto.statusId);
    if (!status) throw new ApiError(404, "NOT_FOUND", "Status not found");

    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: uuid(),
      ...dto,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return toDto(await TicketRepository.create(ticket));
  },

  // Для адміна — без перевірки власника
  update: async (id: string, dto: UpdateTicketRequestDto) => {
    if (dto.statusId) {
      const status = await StatusRepository.findById(dto.statusId);
      if (!status) throw new ApiError(404, "NOT_FOUND", "Status not found");
    }

    const updated = await TicketRepository.update(id, {
      ...dto,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) return null;
    return toDto(updated);
  },

  // IDOR-захист: перевірка власника на рівні БД-запиту
  updateByOwner: async (id: string, ownerUserId: string, dto: UpdateTicketRequestDto) => {
    if (dto.statusId) {
      const status = await StatusRepository.findById(dto.statusId);
      if (!status) throw new ApiError(404, "NOT_FOUND", "Status not found");
    }

    const updated = await TicketRepository.updateByOwner(id, ownerUserId, {
      ...dto,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) return null;
    return toDto(updated);
  },

  delete: (id: string) => TicketRepository.softDelete(id),

  // IDOR-захист: перевірка власника на рівні БД-запиту
  deleteByOwner: (id: string, ownerUserId: string) =>
    TicketRepository.softDeleteByOwner(id, ownerUserId),
};