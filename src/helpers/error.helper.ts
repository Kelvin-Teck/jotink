import { AppError } from "../errors/app-error";
import { ICustomError } from "../types/error.type";

// Helper function to handle MongoDB errors
export const handleMongoError = (error: any): AppError => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));
    return AppError.validationError("Validation failed", { fields: errors });
  }

  if (error.name === "CastError") {
    return AppError.badRequest(`Invalid ${error.path}: ${error.value}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return AppError.conflict(`${field} '${value}' already exists`);
  }

  if (error.name === "DocumentNotFoundError") {
    return AppError.notFound("Document not found");
  }

  return AppError.internal("Database operation failed");
};

// Helper function to handle JWT errors
export const handleJWTError = (error: any): AppError => {
  if (error.name === "JsonWebTokenError") {
    return AppError.unauthorized("Invalid token");
  }

  if (error.name === "TokenExpiredError") {
    return AppError.unauthorized("Token expired");
  }

  if (error.name === "NotBeforeError") {
    return AppError.unauthorized("Token not active");
  }

  return AppError.unauthorized("Authentication failed");
};

// Helper function to handle Multer errors
export const handleMulterError = (error: any): AppError => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return AppError.badRequest("File too large");
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return AppError.badRequest("Too many files");
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return AppError.badRequest("Unexpected file field");
  }

  return AppError.badRequest("File upload failed");
};

// Helper function to sanitize error for production
export const sanitizeError = (
  error: ICustomError,
  isDevelopment: boolean
): any => {
  const sanitized: any = {
    message: error.message,
    code: error.code || "INTERNAL_ERROR",
    statusCode: error.statusCode || 500,
  };

  if (error.details) {
    sanitized.details = error.details;
  }

  // Only include stack trace in development
  // if (isDevelopment && error.stack) {
  //   sanitized.stack = error.stack;
  // }

  return sanitized;
};
