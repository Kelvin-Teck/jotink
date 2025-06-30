import { JwtHelper } from "helpers/jwt.helper";
import { JwtSignPayload } from "types/jwt.type";

export const createAccessToken = (
  payload: JwtSignPayload,
  sessionId?: string
) => JwtHelper.createAccessToken(payload, sessionId);

export const createRefreshToken = (
  payload: JwtSignPayload,
  sessionId?: string
) => JwtHelper.createRefreshToken(payload, sessionId);

export const verifyAccessToken = (token: string) =>
  JwtHelper.verifyAccessToken(token);

export const verifyRefreshToken = (token: string) =>
  JwtHelper.verifyRefreshToken(token);

export const createTokenPair = (payload: JwtSignPayload, sessionId?: string) =>
  JwtHelper.createTokenPair(payload, sessionId);

export const extractTokenFromHeader = (authHeader: string | undefined) =>
  JwtHelper.extractTokenFromHeader(authHeader);

export const refreshAccessToken = (refreshToken: string) =>
  JwtHelper.refreshAccessToken(refreshToken);
