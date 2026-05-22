import { ApiError } from "../errors/api-error";
import { CreateTicketRequestDto, UpdateTicketRequestDto } from "../dtos/ticket.dto";
import { TicketPriority } from "../models/ticket.model";

type UnknownRecord = Record<string, unknown>;

const VALID_PRIORITIES: TicketPriority[] = ["Low", "Medium", "High"];

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPriority(value: unknown): value is TicketPriority {
  return VALID_PRIORITIES.includes(value as TicketPriority);
}

export function validateCreateTicketDto(body: unknown): CreateTicketRequestDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];
  const { subject, message, priority, statusId, authorId } = body;

  if (!isNonEmptyString(subject)) {
    errors.push({ field: "subject", message: "Subject is required" });
  } else if (subject.trim().length < 3 || subject.trim().length > 100) {
    errors.push({ field: "subject", message: "Subject must be 3–100 characters" });
  }

  if (!isNonEmptyString(message)) {
    errors.push({ field: "message", message: "Message is required" });
  } else if (message.trim().length < 10 || message.trim().length > 1000) {
    errors.push({ field: "message", message: "Message must be 10–1000 characters" });
  }

  if (!isPriority(priority)) {
    errors.push({ field: "priority", message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
  }

  if (!isNonEmptyString(statusId)) {
    errors.push({ field: "statusId", message: "statusId is required" });
  }

  if (!isNonEmptyString(authorId)) {
    errors.push({ field: "authorId", message: "authorId is required" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  return {
    subject: String(subject).trim(),
    message: String(message).trim(),
    priority: priority as TicketPriority,
    statusId: String(statusId).trim(),
    authorId: String(authorId).trim(),
  };
}

export function validateUpdateTicketDto(body: unknown): UpdateTicketRequestDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];
  const { subject, message, priority, statusId } = body;

  if (subject !== undefined) {
    if (!isNonEmptyString(subject)) {
      errors.push({ field: "subject", message: "Subject must be a non-empty string" });
    } else if (subject.trim().length < 3 || subject.trim().length > 100) {
      errors.push({ field: "subject", message: "Subject must be 3–100 characters" });
    }
  }

  if (message !== undefined) {
    if (!isNonEmptyString(message)) {
      errors.push({ field: "message", message: "Message must be a non-empty string" });
    } else if (message.trim().length < 10 || message.trim().length > 1000) {
      errors.push({ field: "message", message: "Message must be 10–1000 characters" });
    }
  }

  if (priority !== undefined && !isPriority(priority)) {
    errors.push({ field: "priority", message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
  }

  if (statusId !== undefined && !isNonEmptyString(statusId)) {
    errors.push({ field: "statusId", message: "statusId must be a non-empty string" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const dto: UpdateTicketRequestDto = {};
  if (isNonEmptyString(subject)) dto.subject = subject.trim();
  if (isNonEmptyString(message)) dto.message = message.trim();
  if (isPriority(priority)) dto.priority = priority;
  if (isNonEmptyString(statusId)) dto.statusId = statusId as string;

  return dto;
}