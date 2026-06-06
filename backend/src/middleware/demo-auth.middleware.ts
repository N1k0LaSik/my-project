import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../errors/api-error";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

/**
 * Демо-ідентифікація через заголовок X-Demo-UserId.
 * Замість повноцінного JWT — для навчального проекту.
 *
 * Поведінка:
 *   немає заголовку        → 401
 *   порожній рядок         → 401
 *   userId не існує в БД   → 401
 *   все ок                 → req.user = { id } і next()
 */
export async function demoAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.header("X-Demo-UserId");

  if (!userId || userId.trim() === "") {
    next(new ApiError(401, "UNAUTHORIZED", "Missing X-Demo-UserId header"));
    return;
  }

  const user = await UserRepository.findById(userId.trim());
  if (!user) {
    next(new ApiError(401, "UNAUTHORIZED", "Unknown user id"));
    return;
  }

  req.user = { id: user.id };
  next();
}