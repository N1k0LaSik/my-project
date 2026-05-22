import { v4 as uuid } from "uuid";
import { StatusRepository } from "../repositories/status.repository";
import { CreateStatusRequestDto, UpdateStatusRequestDto } from "../dtos/status.dto";
import { ApiError } from "../errors/api-error";

export const StatusService = {
  getAll: () => StatusRepository.findAll(),

  getById: (id: string) => StatusRepository.findById(id),

  create: (dto: CreateStatusRequestDto) => {
    const existing = StatusRepository.findByName(dto.name);
    if (existing) {
      throw new ApiError(409, "CONFLICT", `Status "${dto.name}" already exists`);
    }
    return StatusRepository.create({ id: uuid(), ...dto });
  },

  update: (id: string, dto: UpdateStatusRequestDto) => {
    if (dto.name) {
      const existing = StatusRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ApiError(409, "CONFLICT", `Status "${dto.name}" already exists`);
      }
    }
    return StatusRepository.update(id, dto);
  },

  delete: (id: string) => StatusRepository.delete(id),
};