import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/app-error";
import { logError } from "../errors/error-logger";
import { IErrorResponse, ICustomError } from "../types/error.type";

// Method to verify passwords
export const verifyPassword = async (
  plainTextPassword: string,
  hashPassword: string
): Promise<boolean> => {
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
