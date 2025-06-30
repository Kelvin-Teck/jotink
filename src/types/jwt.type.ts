import { JwtPayload } from "jsonwebtoken";

// Type definitions

export type UserRole = "user" | "admin" | "moderator" | "premium";



export interface JwtSignPayload {
  id: string;
  email: string;
  role:UserRole;
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  tokenType: "access" | "refresh";
  sessionId?: string;
  iat: number;
  exp: number;
  jti: string; // JWT ID for token tracking iss?: string;
  iss?: string;
  aud?: string;
  nbf?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}

export interface DecodedToken {
  payload: CustomJwtPayload;
  isExpired: boolean;
  expiresIn: number; // seconds until expiry
}
