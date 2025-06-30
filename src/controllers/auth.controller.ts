import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/api-responses";
import * as AuthServices from "../services/auth.service";
import { asyncHandler } from "../middlewares/error-handler.middleware";

export const register = async (req: Request, res: Response) => {
  const response = await AuthServices.createUser(req);

  return res
    .status(201)
    .json(sendSuccess("User created Successfully", response));
};


export const login = async (req: Request, res: Response) => {
  const response = await AuthServices.login(req);

  return res
    .status(200)
    .json(sendSuccess("User Logged In Successfully", response));
};

