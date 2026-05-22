"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateStatusDto = validateCreateStatusDto;
exports.validateUpdateStatusDto = validateUpdateStatusDto;
const api_error_1 = require("../errors/api-error");
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isHexColor(value) {
    return /^#[0-9a-fA-F]{6}$/.test(value);
}
function validateCreateStatusDto(body) {
    if (!isObject(body)) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
            { field: "body", message: "Body must be a JSON object" },
        ]);
    }
    const errors = [];
    const { name, color } = body;
    if (!isNonEmptyString(name)) {
        errors.push({ field: "name", message: "Name is required" });
    }
    else if (name.trim().length < 2 || name.trim().length > 50) {
        errors.push({ field: "name", message: "Name must be 2–50 characters" });
    }
    if (!isNonEmptyString(color)) {
        errors.push({ field: "color", message: "Color is required" });
    }
    else if (!isHexColor(color)) {
        errors.push({ field: "color", message: "Color must be a valid hex color (e.g. #3498db)" });
    }
    if (errors.length > 0) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    return { name: String(name).trim(), color: String(color) };
}
function validateUpdateStatusDto(body) {
    if (!isObject(body)) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", [
            { field: "body", message: "Body must be a JSON object" },
        ]);
    }
    const errors = [];
    const { name, color } = body;
    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            errors.push({ field: "name", message: "Name must be a non-empty string" });
        }
        else if (name.trim().length < 2 || name.trim().length > 50) {
            errors.push({ field: "name", message: "Name must be 2–50 characters" });
        }
    }
    if (color !== undefined) {
        if (!isNonEmptyString(color)) {
            errors.push({ field: "color", message: "Color must be a non-empty string" });
        }
        else if (!isHexColor(color)) {
            errors.push({ field: "color", message: "Color must be a valid hex color (e.g. #3498db)" });
        }
    }
    if (errors.length > 0) {
        throw new api_error_1.ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    const dto = {};
    if (isNonEmptyString(name))
        dto.name = name.trim();
    if (isNonEmptyString(color))
        dto.color = color;
    return dto;
}
