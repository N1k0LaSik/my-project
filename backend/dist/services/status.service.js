"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const uuid_1 = require("uuid");
const status_repository_1 = require("../repositories/status.repository");
const api_error_1 = require("../errors/api-error");
exports.StatusService = {
    getAll: () => status_repository_1.StatusRepository.findAll(),
    getById: (id) => status_repository_1.StatusRepository.findById(id),
    create: (dto) => {
        const existing = status_repository_1.StatusRepository.findByName(dto.name);
        if (existing) {
            throw new api_error_1.ApiError(409, "CONFLICT", `Status "${dto.name}" already exists`);
        }
        return status_repository_1.StatusRepository.create({ id: (0, uuid_1.v4)(), ...dto });
    },
    update: (id, dto) => {
        if (dto.name) {
            const existing = status_repository_1.StatusRepository.findByName(dto.name);
            if (existing && existing.id !== id) {
                throw new api_error_1.ApiError(409, "CONFLICT", `Status "${dto.name}" already exists`);
            }
        }
        return status_repository_1.StatusRepository.update(id, dto);
    },
    delete: (id) => status_repository_1.StatusRepository.delete(id),
};
