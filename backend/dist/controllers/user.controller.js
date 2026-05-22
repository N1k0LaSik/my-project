"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.patchUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const user_validator_1 = require("../validators/user.validator");
const api_error_1 = require("../errors/api-error");
function toResponseDto(user) {
    return { id: user.id, name: user.name, email: user.email };
}
const getUsers = (req, res) => {
    const all = user_service_1.UserService.getAll();
    return res.status(200).json({ items: all.map(toResponseDto), total: all.length });
};
exports.getUsers = getUsers;
const getUserById = (req, res, next) => {
    const user = user_service_1.UserService.getById(String(req.params.id));
    if (!user)
        return next(new api_error_1.ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(200).json(toResponseDto(user));
};
exports.getUserById = getUserById;
const createUser = (req, res, next) => {
    try {
        const dto = (0, user_validator_1.validateCreateUserDto)(req.body);
        const user = user_service_1.UserService.create(dto);
        return res.status(201).json(toResponseDto(user));
    }
    catch (err) {
        return next(err);
    }
};
exports.createUser = createUser;
const updateUser = (req, res, next) => {
    try {
        const dto = (0, user_validator_1.validateUpdateUserDto)(req.body);
        const user = user_service_1.UserService.update(String(req.params.id), dto);
        if (!user)
            return next(new api_error_1.ApiError(404, "NOT_FOUND", "User not found"));
        return res.status(200).json(toResponseDto(user));
    }
    catch (err) {
        return next(err);
    }
};
exports.updateUser = updateUser;
const patchUser = (req, res, next) => {
    try {
        const dto = (0, user_validator_1.validateUpdateUserDto)(req.body);
        const user = user_service_1.UserService.update(String(req.params.id), dto);
        if (!user)
            return next(new api_error_1.ApiError(404, "NOT_FOUND", "User not found"));
        return res.status(200).json(toResponseDto(user));
    }
    catch (err) {
        return next(err);
    }
};
exports.patchUser = patchUser;
const deleteUser = (req, res, next) => {
    const deleted = user_service_1.UserService.delete(String(req.params.id));
    if (!deleted)
        return next(new api_error_1.ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(204).send();
};
exports.deleteUser = deleteUser;
