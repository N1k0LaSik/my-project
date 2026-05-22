import { ApiError } from "../errors/api-error";
import { CreateStatusRequestDto, UpdateStatusRequestDto } from "../dtos/status.dto";

type UnknownRecord = Record<string, unknown>;

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function validateCreateStatusDto(body: unknown): CreateStatusRequestDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];
  const { name, color } = body as Record<string, unknown>;

  if (!isNonEmptyString(name)) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (name.trim().length < 2 || name.trim().length > 50) {
    errors.push({ field: "name", message: "Name must be 2–50 characters" });
  }

  if (!isNonEmptyString(color)) {
    errors.push({ field: "color", message: "Color is required" });
  } else if (!isHexColor(color)) {
    errors.push({ field: "color", message: "Color must be a valid hex color (e.g. #3498db)" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  return { name: String(name).trim(), color: String(color) };
}

export function validateUpdateStatusDto(body: unknown): UpdateStatusRequestDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];
  const { name, color } = body as Record<string, unknown>;

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      errors.push({ field: "name", message: "Name must be a non-empty string" });
    } else if (name.trim().length < 2 || name.trim().length > 50) {
      errors.push({ field: "name", message: "Name must be 2–50 characters" });
    }
  }

  if (color !== undefined) {
    if (!isNonEmptyString(color)) {
      errors.push({ field: "color", message: "Color must be a non-empty string" });
    } else if (!isHexColor(color as string)) {
      errors.push({ field: "color", message: "Color must be a valid hex color (e.g. #3498db)" });
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const dto: UpdateStatusRequestDto = {};
  if (isNonEmptyString(name)) dto.name = name.trim();
  if (isNonEmptyString(color)) dto.color = color as string;

  return dto;
}