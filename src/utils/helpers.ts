import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/app-error";
import { logError } from "../errors/error-logger";
import { IErrorResponse, ICustomError } from "../types/error.type";

// Method to verify passwords
export const verifyPassword = async  (plainTextPassword: string,
  hashPassword: string
): Promise<boolean> =>{
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

// Define a constant for the salt rounds
const saltRounds = 10;

// Function to hash the password
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Function to compare the password with the hashed password
export const comparePassword = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};



// Helper function to generate request ID
export const generateRequestId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

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





// Configuration with validation


// Export the helper functions for backward compatibility

// Usage example with authentication middleware
/*
// middleware/auth.ts



*/