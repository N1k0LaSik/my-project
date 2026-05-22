"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTicketMessageDto = validateCreateTicketMessageDto;
const api_error_1 = require("../errors/api-error");
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function validateCreateTicketMessageDto(body) {
    if (!isObject(body)) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
            { field: "body", message: "Body must be a JSON object" },
        ]);
    }
    const errors = [];
    const { authorId, content } = body;
    if (!isNonEmptyString(authorId)) {
        errors.push({ field: "authorId", message: "authorId is required" });
    }
    if (!isNonEmptyString(content)) {
        errors.push({ field: "content", message: "Content is required" });
    }
    else if (content.trim().length < 2 || content.trim().length > 500) {
        errors.push({ field: "content", message: "Content must be 2–500 characters" });
    }
    if (errors.length > 0) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    return {
        authorId: String(authorId).trim(),
        content: String(content).trim(),
    };
}
