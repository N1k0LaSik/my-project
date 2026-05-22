import { NextFunction, Request, Response } from "express";
import { StatusService } from "../services/status.service";
import { validateCreateStatusDto, validateUpdateStatusDto } from "../validators/status.validator";
import { StatusResponseDto } from "../dtos/status.dto";
import { ApiError } from "../errors/api-error";

function toDto(s: { id: string; name: string; color: string }): StatusResponseDto {
  return { id: s.id, name: s.name, color: s.color };
}

export const getStatuses = (_req: Request, res: Response) => {
  const all = StatusService.getAll();
  return res.status(200).json({ items: all.map(toDto), total: all.length });
};

export const getStatusById = (req: Request, res: Response, next: NextFunction) => {
  const status = StatusService.getById(String(req.params.id));
  if (!status) return next(new ApiError(404, "NOT_FOUND", "Status not found"));
  return res.status(200).json(toDto(status));
};

export const createStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateCreateStatusDto(req.body);
    const status = StatusService.create(dto);
    return res.status(201).json(toDto(status));
  } catch (err) {
    return next(err);
  }
};

export const updateStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = validateUpdateStatusDto(req.body);
    const status = StatusService.update(String(req.params.id), dto);
    if (!status) return next(new ApiError(404, "NOT_FOUND", "Status not found"));
    return res.status(200).json(toDto(status));
  } catch (err) {
    return next(err);
  }
};

export const deleteStatus = (req: Request, res: Response, next: NextFunction) => {
  const deleted = StatusService.delete(String(req.params.id));
  if (!deleted) return next(new ApiError(404, "NOT_FOUND", "Status not found"));
  return res.status(204).send();
};