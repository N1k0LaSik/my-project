import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { validateCreateUserDto, validateUpdateUserDto } from "../validators/user.validator";
import { UserResponseDto } from "../dtos/user.dto";
import { ApiError } from "../errors/api-error";

function toResponseDto(user: { id: string; name: string; email: string }): UserResponseDto {
  return { id: user.id, name: user.name, email: user.email };
}

export const getUsers = (req: Request, res: Response) => {
  const all = UserService.getAll();
  return res.status(200).json({ items: all.map(toResponseDto), total: all.length });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const user = UserService.getById(String(req.params.id));
  if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
  return res.status(200).json(toResponseDto(user));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateUserDto(req.body);
    const user = UserService.create(dto);
    return res.status(201).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateUserDto(req.body);
    const user = UserService.update(String(req.params.id), dto);
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(200).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const patchUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateUserDto(req.body);
    const user = UserService.update(String(req.params.id), dto);
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    return res.status(200).json(toResponseDto(user));
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const deleted = UserService.delete(String(req.params.id));
  if (!deleted) return next(new ApiError(404, "NOT_FOUND", "User not found"));
  return res.status(204).send();
};