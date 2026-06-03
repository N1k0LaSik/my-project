import { v4 as uuid } from "uuid";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

export const UserService = {
  getAll: () => UserRepository.findAll(),

  getById: (id: string) => UserRepository.findById(id),

  create: (dto: CreateUserDto) => {
    const user = {
      id: uuid(),
      ...dto,
      createdAt: new Date().toISOString(),
    };
    return UserRepository.create(user);
  },

  update: (id: string, dto: UpdateUserDto) => {
    return UserRepository.update(id, dto);
  },

  delete: (id: string) => {
    return UserRepository.delete(id);
  },
};