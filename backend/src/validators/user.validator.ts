import { ApiError } from "../errors/api-error";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

type UnknownRecord = Record<string, unknown>;

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateCreateUserDto(body: unknown): CreateUserDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];

  const nameValue = body["name"];
  const emailValue = body["email"];

  if (!isNonEmptyString(nameValue)) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (nameValue.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!isNonEmptyString(emailValue)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!isEmail(emailValue)) {
    errors.push({ field: "email", message: "Email format is invalid" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  return {
    name: String(nameValue).trim(),
    email: String(emailValue).trim(),
  };
}

export function validateUpdateUserDto(body: unknown): UpdateUserDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];

  const nameValue = body["name"];
  const emailValue = body["email"];

  if (nameValue !== undefined) {
    if (!isNonEmptyString(nameValue)) {
      errors.push({ field: "name", message: "Name must be a non-empty string" });
    } else if (nameValue.trim().length < 2) {
      errors.push({ field: "name", message: "Name must be at least 2 characters" });
    }
  }

  if (emailValue !== undefined) {
    if (!isNonEmptyString(emailValue)) {
      errors.push({ field: "email", message: "Email must be a non-empty string" });
    } else if (!isEmail(emailValue)) {
      errors.push({ field: "email", message: "Email format is invalid" });
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const dto: UpdateUserDto = {};

  if (isNonEmptyString(nameValue)) {
    dto.name = nameValue.trim();
  }

  if (isNonEmptyString(emailValue)) {
    dto.email = emailValue.trim();
  }

  return dto;
}