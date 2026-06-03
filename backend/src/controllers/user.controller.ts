import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { validateCreateUserDto, validateUpdateUserDto } from "../validators/user.validator";
import { UserResponseDto } from "../dtos/user.dto";
import { ApiError } from "../errors/api-error";

function toResponseDto(user: { id: string; name: string; email: string }): UserResponseDto {
  return { id: user.id, name: user.name, email: user.email };
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const all = await UserService.getAll();
    return res.status(200).json({ items: all.map(toResponseDto), total: all.length });
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getById(String(req.params.id));
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(200).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateUserDto(req.body);
    const user = await UserService.create(dto);
    return res.status(201).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateUserDto(req.body);
    const user = await UserService.update(String(req.params.id), dto);
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(200).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateUserDto(req.body);
    const user = await UserService.update(String(req.params.id), dto);
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(200).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await UserService.delete(String(req.params.id));
    if (!deleted) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};