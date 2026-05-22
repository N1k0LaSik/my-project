export type ApiErrorDetails = Array<{ field?: string; message: string }>;

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: ApiErrorDetails;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: ApiErrorDetails
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}