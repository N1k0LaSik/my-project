import { NextFunction, Request, Response } from "express";

/**
 * Базові HTTP security headers.
 * Підключається глобально в app.ts перед усіма роутами.
 */
export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // Забороняє браузеру вгадувати тип контенту (MIME-sniffing)
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Забороняє вбудовувати сторінку в iframe (clickjacking)
  res.setHeader("X-Frame-Options", "DENY");

  // Браузер не відправляє Referer заголовок
  res.setHeader("Referrer-Policy", "no-referrer");

  // Тільки HTTPS з'єднання (актуально для production)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  next();
}