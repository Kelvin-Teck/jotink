import { Request, Response, NextFunction } from "express";
import { JwtHelper } from "../helpers/jwt.helper";
import { AppError } from "../errors/app-error";
import { asyncHandler } from "../middlewares/error-handler.middleware";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    sessionId?: string;
  };
}

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);
    const decoded = JwtHelper.verifyAccessToken(token);

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };

    next();
  }
);

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden("Insufficient permissions");
    }

    next();
  };
};
