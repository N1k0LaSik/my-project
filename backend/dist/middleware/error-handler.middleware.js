"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const api_error_1 = require("../errors/api-error");
function errorHandler(err, _req, res, _next) {
    if (err instanceof api_error_1.ApiError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details ?? [],
            },
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Unexpected server error",
            details: [],
        },
    });
}
