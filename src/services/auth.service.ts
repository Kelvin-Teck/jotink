import { AppError } from "errors/app-error";
import { Request } from "express";
import * as UserRepository from "../repositories/user.repo";
import { JwtHelper } from "helpers/jwt.helper";
import { comparePassword, hashPassword } from "utils/helpers";

export const createUser = async (req: Request) => {
  const { username, email, password, role } = req.body;

  const existingUser = await UserRepository.findUserByEmail(email);

  if (existingUser)
    throw AppError.conflict("A user already Exist with this email");

  const encryptedPassword = await hashPassword(password);

  const newUserData = { username, email, password: encryptedPassword, role };
  const newUser = await UserRepository.createUser(newUserData);

  const token = JwtHelper.createAccessToken({
    id: newUser?._id.toString(),
    email: newUser.email,
    role: role ?? "user",
  });

  return { token };
};

export const login = async (req: Request) => {
  const { identifier, password: plainTextPassword } = req.body;

  const user = await UserRepository.findByIdentifier(identifier);

  if (!user) throw AppError.unauthorized("Invalid email/username");

  const isPasswordMatch = await comparePassword(
    plainTextPassword,
    user?.password
  );

  if (!isPasswordMatch) throw AppError.unauthorized("Invalid password");

  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const tokenPair = JwtHelper.createTokenPair(payload);

  const tokens = tokenPair;
  const { password, ...safeUser } = user;

  return { user: safeUser, tokens };
};
