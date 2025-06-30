import { AppError } from "../errors/app-error";
import { Request } from "express";
import * as UserRepository from "../repositories/user.repo";
import { JwtHelper } from "../helpers/jwt.helper";
import { comparePassword, hashPassword } from "../helpers/credential.helper";

/**
 * Handles user registration logic
 * - Checks for existing user by email
 * - Hashes the password securely
 * - Saves new user to the database
 * - Generates an access token for immediate login
 */
export const createUser = async (req: Request) => {
  const { username, email, password, role } = req.body;

  // Check if user with email already exists
  const existingUser = await UserRepository.findUserByEmail(email);
  if (existingUser)
    throw AppError.conflict("A user already exists with this email");

  // Encrypt the password before storing
  const encryptedPassword = await hashPassword(password);

  // Create new user data object
  const newUserData = { username, email, password: encryptedPassword, role };

  // Save the user in the database
  const newUser = await UserRepository.createUser(newUserData);

  // Generate access token for immediate login after registration
  const token = JwtHelper.createAccessToken({
    id: newUser?._id.toString(),
    email: newUser.email,
    role: role ?? "user", // fallback to default 'user' role
  });

  return { token };
};

/**
 * Handles user login logic
 * - Accepts identifier (username or email) and password
 * - Validates user existence
 * - Verifies password match
 * - Issues access and refresh tokens
 */
export const login = async (req: Request) => {
  const { identifier, password: plainTextPassword } = req.body;

  // Lookup user by username or email
  const user = await UserRepository.findByIdentifier(identifier);
  if (!user) throw AppError.unauthorized("Invalid email/username");

  // Validate password
  const isPasswordMatch = await comparePassword(
    plainTextPassword,
    user?.password
  );
  if (!isPasswordMatch) throw AppError.unauthorized("Invalid password");

  // Prepare payload for token generation
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  // Generate access and refresh tokens
  const tokenPair = JwtHelper.createTokenPair(payload);

  // Exclude password before returning user data
  const { password, ...safeUser } = user;

  return {
    user: safeUser, // user info (excluding password)
    tokens: tokenPair, // access and refresh tokens
  };
};
