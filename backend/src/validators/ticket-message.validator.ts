import { ApiError } from "../errors/api-error";
import { CreateTicketMessageRequestDto } from "../dtos/ticket-message.dto";

type UnknownRecord = Record<string, unknown>;

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateTicketMessageDto(body: unknown): CreateTicketMessageRequestDto {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
      { field: "body", message: "Body must be a JSON object" },
    ]);
  }

  const errors: Array<{ field: string; message: string }> = [];
  const { authorId, content } = body;

  if (!isNonEmptyString(authorId)) {
    errors.push({ field: "authorId", message: "authorId is required" });
  }

  if (!isNonEmptyString(content)) {
    errors.push({ field: "content", message: "Content is required" });
  } else if ((content as string).trim().length < 2 || (content as string).trim().length > 500) {
    errors.push({ field: "content", message: "Content must be 2–500 characters" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  return {
    authorId: String(authorId).trim(),
    content: String(content).trim(),
  };
}