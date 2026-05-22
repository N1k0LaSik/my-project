"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const uuid_1 = require("uuid");
const user_repository_1 = require("../repositories/user.repository");
exports.UserService = {
    getAll: () => user_repository_1.UserRepository.findAll(),
    getById: (id) => user_repository_1.UserRepository.findById(id),
    create: (dto) => {
        const user = {
            id: (0, uuid_1.v4)(),
            ...dto,
        };
        return user_repository_1.UserRepository.create(user);
    },
    update: (id, dto) => {
        return user_repository_1.UserRepository.update(id, dto);
    },
    delete: (id) => {
        return user_repository_1.UserRepository.delete(id);
    },
};
