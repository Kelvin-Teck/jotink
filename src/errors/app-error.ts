import { ICustomError } from "types/error.type";

export class AppError extends Error implements ICustomError {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: any
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  // Static factory methods for common errors
  static badRequest(message: string = "Bad Request", details?: any): AppError {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(
    message: string = "Unauthorized access",
    details?: any
  ): AppError {
    return new AppError(message, 401, "UNAUTHORIZED", details);
  }

  static forbidden(
    message: string = "Access forbidden",
    details?: any
  ): AppError {
    return new AppError(message, 403, "FORBIDDEN", details);
  }

  static notFound(
    message: string = "Resource not found",
    details?: any
  ): AppError {
    return new AppError(message, 404, "NOT_FOUND", details);
  }

  static conflict(
    message: string = "Resource conflict",
    details?: any
  ): AppError {
    return new AppError(message, 409, "CONFLICT", details);
  }

  static validationError(
    message: string = "Validation failed",
    details?: any
  ): AppError {
    return new AppError(message, 422, "VALIDATION_ERROR", details);
  }

  static tooManyRequests(
    message: string = "Too many requests",
    details?: any
  ): AppError {
    return new AppError(message, 429, "TOO_MANY_REQUESTS", details);
  }

  static internal(
    message: string = "Internal server error",
    details?: any
  ): AppError {
    return new AppError(message, 500, "INTERNAL_ERROR", details);
  }

  static serviceUnavailable(
    message: string = "Service unavailable",
    details?: any
  ): AppError {
    return new AppError(message, 503, "SERVICE_UNAVAILABLE", details);
  }
}
