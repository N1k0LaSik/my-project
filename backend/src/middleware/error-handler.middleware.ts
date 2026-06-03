import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? [],
      },
    });
  }

  const msg = String(err instanceof Error ? err.message : err);

  if (msg.includes("UNIQUE constraint failed")) {
    return res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "Unique constraint violation",
        details: [],
      },
    });
  }

  if (msg.includes("NOT NULL constraint failed") || msg.includes("CHECK constraint failed")) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid data",
        details: [],
      },
    });
  }

  if (msg.includes("FOREIGN KEY constraint failed")) {
    return res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "Related resource not found or cannot be deleted",
        details: [],
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