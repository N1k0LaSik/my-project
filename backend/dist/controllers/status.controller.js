"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStatus = exports.updateStatus = exports.createStatus = exports.getStatusById = exports.getStatuses = void 0;
const status_service_1 = require("../services/status.service");
const status_validator_1 = require("../validators/status.validator");
const api_error_1 = require("../errors/api-error");
function toDto(s) {
    return { id: s.id, name: s.name, color: s.color };
}
const getStatuses = (_req, res) => {
    const all = status_service_1.StatusService.getAll();
    return res.status(200).json({ items: all.map(toDto), total: all.length });
};
exports.getStatuses = getStatuses;
const getStatusById = (req, res, next) => {
    const status = status_service_1.StatusService.getById(String(req.params.id));
    if (!status)
        return next(new api_error_1.ApiError(404, "NOT_FOUND", "Status not found"));
    return res.status(200).json(toDto(status));
};
exports.getStatusById = getStatusById;
const createStatus = (req, res, next) => {
    try {
        const dto = (0, status_validator_1.validateCreateStatusDto)(req.body);
        const status = status_service_1.StatusService.create(dto);
        return res.status(201).json(toDto(status));
    }
    catch (err) {
        return next(err);
    }
};
exports.createStatus = createStatus;
const updateStatus = (req, res, next) => {
    try {
        const dto = (0, status_validator_1.validateUpdateStatusDto)(req.body);
        const status = status_service_1.StatusService.update(String(req.params.id), dto);
        if (!status)
            return next(new api_error_1.ApiError(404, "NOT_FOUND", "Status not found"));
        return res.status(200).json(toDto(status));
    }
    catch (err) {
        return next(err);
    }
};
exports.updateStatus = updateStatus;
const deleteStatus = (req, res, next) => {
    const deleted = status_service_1.StatusService.delete(String(req.params.id));
    if (!deleted)
        return next(new api_error_1.ApiError(404, "NOT_FOUND", "Status not found"));
    return res.status(204).send();
};
exports.deleteStatus = deleteStatus;
