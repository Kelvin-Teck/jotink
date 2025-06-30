import { AppError } from "errors/app-error";
import { logError } from "errors/error-logger";
import {
  generateRequestId,
  handleJWTError,
  handleMongoError,
  handleMulterError,
  sanitizeError,
} from "utils/helpers";
import mongoose from "mongoose";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { IErrorResponse } from "types/error.type";
import { Server } from "http";

// Error handler middleware
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDevelopment = process.env.APP_ENV === "development";
  const requestId = (req as any)?.id || generateRequestId();

  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof mongoose.Error) {
    appError = handleMongoError(error);
  } else if (
    typeof error === "object" &&
    error !== null &&
    (error as any).name?.includes("JWT")
  ) {
    appError = handleJWTError(error as Error);
  } else if (
    typeof error === "object" &&
    error !== null &&
    (error as any).name === "MulterError"
  ) {
    appError = handleMulterError(error);
  } else if ((error as any)?.type === "entity.parse.failed") {
    appError = AppError.badRequest("Invalid JSON payload");
  } else if ((error as any)?.code === "EBADCSRFTOKEN") {
    appError = AppError.forbidden("Invalid CSRF token");
  } else if ((error as any)?.status === 413) {
    appError = AppError.badRequest("Payload too large");
  } else {
    const errMsg =
      typeof error === "object" && error !== null && "message" in error
        ? (error as any).message
        : "Something went wrong";
    appError = AppError.internal(
      isDevelopment ? errMsg : "Something went wrong"
    );
  }

  logError(error as Error, req, {
    requestId,
    originalError: (error as any)?.name,
  });

  const errorResponse: IErrorResponse = {
    success: false,
    error: {
      ...sanitizeError(appError, isDevelopment),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      requestId,
    },
  };

  res.status(appError.statusCode).json(errorResponse);
};

// 404 Not Found handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = AppError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Joi or Zod validation middleware
export const validationHandler = (
  schema: any,
  property: "body" | "params" | "query" = "body"
): RequestHandler => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const details = error.details.map((detail: any) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      throw AppError.validationError("Validation failed", { fields: details });
    }

    next();
  };
};

// Global unhandled promise rejections
export const handleUnhandledRejection = (): void => {
  process.on("unhandledRejection", (reason: any, promise) => {
    logError(new Error(`Unhandled Rejection: ${reason}`), null, { promise });
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });
};

// Global uncaught exceptions
export const handleUncaughtException = (): void => {
  process.on("uncaughtException", (error: Error) => {
    logError(error, null, { type: "uncaughtException" });
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });
};

// Graceful shutdown middleware
export const gracefulShutdown = (server: Server): void => {
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close((err?: Error) => {
      if (err) {
        console.error("Error during server shutdown:", err);
        process.exit(1);
      }

      console.log("Server closed successfully");
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};
