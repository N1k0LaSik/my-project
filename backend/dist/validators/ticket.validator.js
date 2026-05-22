"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTicketDto = validateCreateTicketDto;
exports.validateUpdateTicketDto = validateUpdateTicketDto;
const api_error_1 = require("../errors/api-error");
const VALID_PRIORITIES = ["Low", "Medium", "High"];
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isPriority(value) {
    return VALID_PRIORITIES.includes(value);
}
function validateCreateTicketDto(body) {
    if (!isObject(body)) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
            { field: "body", message: "Body must be a JSON object" },
        ]);
    }
    const errors = [];
    const { subject, message, priority, statusId, authorId } = body;
    if (!isNonEmptyString(subject)) {
        errors.push({ field: "subject", message: "Subject is required" });
    }
    else if (subject.trim().length < 3 || subject.trim().length > 100) {
        errors.push({ field: "subject", message: "Subject must be 3–100 characters" });
    }
    if (!isNonEmptyString(message)) {
        errors.push({ field: "message", message: "Message is required" });
    }
    else if (message.trim().length < 10 || message.trim().length > 1000) {
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
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    return {
        subject: String(subject).trim(),
        message: String(message).trim(),
        priority: priority,
        statusId: String(statusId).trim(),
        authorId: String(authorId).trim(),
    };
}
function validateUpdateTicketDto(body) {
    if (!isObject(body)) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
            { field: "body", message: "Body must be a JSON object" },
        ]);
    }
    const errors = [];
    const { subject, message, priority, statusId } = body;
    if (subject !== undefined) {
        if (!isNonEmptyString(subject)) {
            errors.push({ field: "subject", message: "Subject must be a non-empty string" });
        }
        else if (subject.trim().length < 3 || subject.trim().length > 100) {
            errors.push({ field: "subject", message: "Subject must be 3–100 characters" });
        }
    }
    if (message !== undefined) {
        if (!isNonEmptyString(message)) {
            errors.push({ field: "message", message: "Message must be a non-empty string" });
        }
        else if (message.trim().length < 10 || message.trim().length > 1000) {
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
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    const dto = {};
    if (isNonEmptyString(subject))
        dto.subject = subject.trim();
    if (isNonEmptyString(message))
        dto.message = message.trim();
    if (isPriority(priority))
        dto.priority = priority;
    if (isNonEmptyString(statusId))
        dto.statusId = statusId;
    return dto;
}
