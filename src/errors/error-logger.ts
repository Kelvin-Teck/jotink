import winston from "winston";
import { AppError } from "./app-error";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "notes-api" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Add console logging in development
if (process.env.APP_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export const logError = (error: Error, req?: any, additionalInfo?: any) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...(req && {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      userId: req.user?.id,
      requestId: req.id,
    }),
    ...additionalInfo,
  };

  if (error instanceof AppError && error.isOperational) {
    logger.warn("Operational Error", errorInfo);
  } else {
    logger.error("System Error", errorInfo);
  }
};
