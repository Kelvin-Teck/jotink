import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import crypto from "crypto";
import { AppError } from "../errors/app-error";
import JwtConfig from "config/jwt.config";
import { CustomJwtPayload, DecodedToken, JwtSignPayload, TokenPair } from "types/jwt.type";

type JwtExpiryString =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`;


// JWT Helper Class
export class JwtHelper {
    private static config = JwtConfig.getInstance();
    private static algorithm:jwt.Algorithm = 'HS256'; // Explicitly set algorithm
  
    /**
     * Generate a unique JWT ID for token tracking
     */
    private static generateJwtId(): string {
      return crypto.randomBytes(16).toString('hex');
    }
  
    /**
     * Calculate expiry date from expiry string
     */
    private static calculateExpiryDate(expiresIn: string): Date {
      const now = new Date();
      const expiry = new Date(now);
      
      // Parse expiry string (e.g., '15m', '7d', '1h')
      const match = expiresIn.match(/^(\d+)([smhd])$/);
      if (!match) {
        throw new Error(`Invalid expiry format: ${expiresIn}`);
      }
  
      const [, amount, unit] = match;
      const value = parseInt(amount, 10);
  
      switch (unit) {
        case 's':
          expiry.setSeconds(expiry.getSeconds() + value);
          break;
        case 'm':
          expiry.setMinutes(expiry.getMinutes() + value);
          break;
        case 'h':
          expiry.setHours(expiry.getHours() + value);
          break;
        case 'd':
          expiry.setDate(expiry.getDate() + value);
          break;
        default:
          throw new Error(`Invalid time unit: ${unit}`);
      }
  
      return expiry;
    }
  
    /**
     * Create access token with enhanced security
     */
    public static createAccessToken(
      payload: JwtSignPayload, 
      sessionId?: string,
      customExpiry?: string
    ): string {
      const jwtId = this.generateJwtId();
        //   const expiresIn = customExpiry || this.config.accessTokenExpiry;
        const expiresIn = (customExpiry ||
          this.config.accessTokenExpiry) as JwtExpiryString;
    

  
      const tokenPayload = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        tokenType: 'access' as const,
        sessionId,
      };
  
      const options: SignOptions = {
        expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithm: this.algorithm,
        notBefore: '0s', // Token is valid immediately
        jwtid: jwtId
        };
        
  
      try {
        return jwt.sign(tokenPayload, this.config.accessTokenSecret, options);
      } catch (error) {
        
        throw AppError.internal('Failed to create access token');
      }
    }
  
    /**
     * Create refresh token with enhanced security
     */
    public static createRefreshToken(
      payload: JwtSignPayload, 
      sessionId?: string,
      customExpiry?: string
    ): string {
      const jwtId = this.generateJwtId();
        //   const expiresIn = customExpiry || this.config.refreshTokenExpiry;
        const expiresIn = (customExpiry || this.config.accessTokenExpiry) as JwtExpiryString

  
      const tokenPayload = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        tokenType: 'refresh' as const,
        sessionId,
      };
  
      const options: SignOptions = {
        expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithm: this.algorithm as 'HS256',
        jwtid: jwtId
        };
        

        
      try {
        return jwt.sign(tokenPayload, this.config.refreshTokenSecret, options);
      } catch (error) {
        
        throw AppError.internal('Failed to create refresh token');
      }
    }
  
    /**
     * Create both access and refresh tokens
     */
    public static createTokenPair(payload: JwtSignPayload, sessionId?: string): TokenPair {
      const generatedSessionId = sessionId || crypto.randomUUID();
    

      const accessToken = this.createAccessToken(payload, generatedSessionId);
      const refreshToken = this.createRefreshToken(payload, generatedSessionId);
  
      return {
        accessToken,
        refreshToken,
        accessTokenExpiry: this.calculateExpiryDate(this.config.accessTokenExpiry),
        refreshTokenExpiry: this.calculateExpiryDate(this.config.refreshTokenExpiry)
      };
    }
  
    /**
     * Verify access token with comprehensive error handling
     */
    public static verifyAccessToken(token: string): CustomJwtPayload {
      if (!token || typeof token !== 'string') {
        throw AppError.unauthorized('Invalid token format');
      }
  
      const options: VerifyOptions = {
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithms: [this.algorithm],
        clockTolerance: 30 // 30 seconds clock tolerance
      };
  
      try {
        const decoded = jwt.verify(token, this.config.accessTokenSecret, options) as CustomJwtPayload;
        
        // Verify token type
        if (decoded.tokenType !== 'access') {
          throw AppError.unauthorized('Invalid token type');
        }
  
        // Additional security checks
        if (!decoded.id || !decoded.email || !decoded.role) {
          throw AppError.unauthorized('Invalid token payload');
        }
  
        return decoded;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
  
        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
          if (error.name === 'TokenExpiredError') {
            throw AppError.unauthorized('Access token has expired');
          }
          if (error.name === 'JsonWebTokenError') {
            throw AppError.unauthorized('Invalid access token');
          }
          if (error.name === 'NotBeforeError') {
            throw AppError.unauthorized('Access token not yet valid');
          }
        }
  
        throw AppError.unauthorized('Token verification failed');
      }
    }
  
    /**
     * Verify refresh token with comprehensive error handling
     */
    public static verifyRefreshToken(token: string): CustomJwtPayload {
      if (!token || typeof token !== 'string') {
        throw AppError.unauthorized('Invalid refresh token format');
      }
  
      const options: VerifyOptions = {
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithms: [this.algorithm],
        clockTolerance: 30
      };
  
      try {
        const decoded = jwt.verify(token, this.config.refreshTokenSecret, options) as CustomJwtPayload;
        
        // Verify token type
        if (decoded.tokenType !== 'refresh') {
          throw AppError.unauthorized('Invalid refresh token type');
        }
  
        // Additional security checks
        if (!decoded.id || !decoded.email || !decoded.role) {
          throw AppError.unauthorized('Invalid refresh token payload');
        }
  
        return decoded;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
  
        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
          if (error.name === 'TokenExpiredError') {
            throw AppError.unauthorized('Refresh token has expired');
          }
          if (error.name === 'JsonWebTokenError') {
            throw AppError.unauthorized('Invalid refresh token');
          }
          if (error.name === 'NotBeforeError') {
            throw AppError.unauthorized('Refresh token not yet valid');
          }
        }
  
        throw AppError.unauthorized('Refresh token verification failed');
      }
    }
  
    /**
     * Decode token without verification (for debugging/logging)
     */
    public static decodeToken(token: string): DecodedToken | null {
      try {
        const decoded = jwt.decode(token) as CustomJwtPayload;
        if (!decoded) return null;
  
        const now = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp ? decoded.exp < now : false;
        const expiresIn = decoded.exp ? decoded.exp - now : 0;
  
        return {
          payload: decoded,
          isExpired,
          expiresIn
        };
      } catch (error) {
        return null;
      }
    }
  
    /**
     * Extract token from Authorization header
     */
    public static extractTokenFromHeader(authHeader: string | undefined): string {
      if (!authHeader) {
        throw AppError.unauthorized('Authorization header missing');
      }
  
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw AppError.unauthorized('Invalid authorization header format');
      }
  
      const token = parts[1];
      if (!token) {
        throw AppError.unauthorized('Token missing from authorization header');
      }
  
      return token;
    }
  
    /**
     * Refresh access token using refresh token
     */
    public static refreshAccessToken(refreshToken: string): {
      accessToken: string;
      accessTokenExpiry: Date;
    } {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      const newAccessToken = this.createAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role as 'user' | 'admin' | 'moderator'
      }, decoded.sessionId);
  
      return {
        accessToken: newAccessToken,
        accessTokenExpiry: this.calculateExpiryDate(this.config.accessTokenExpiry)
      };
    }
  
    /**
     * Get token expiry information
     */
    public static getTokenInfo(token: string): {
      isValid: boolean;
      isExpired: boolean;
      expiresIn: number;
      payload?: CustomJwtPayload;
    } {
      const decoded = this.decodeToken(token);
      
      if (!decoded) {
        return {
          isValid: false,
          isExpired: true,
          expiresIn: 0
        };
      }
  
      return {
        isValid: true,
        isExpired: decoded.isExpired,
        expiresIn: decoded.expiresIn,
        payload: decoded.payload
      };
    }
  
    /**
     * Validate token strength and format
     */
    public static validateTokenFormat(token: string): boolean {
      if (!token || typeof token !== 'string') {
        return false;
      }
  
      // JWT should have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
  
      // Each part should be base64url encoded
      try {
        parts.forEach(part => {
          if (!part || part.length === 0) {
            throw new Error('Empty part');
          }
          // Try to decode each part
          Buffer.from(part, 'base64url');
        });
        return true;
      } catch {
        return false;
      }
    }
  
    /**
     * Generate secure random secret (for setup/testing)
     */
    public static generateSecureSecret(length: number = 64): string {
      return crypto.randomBytes(length).toString('hex');
    }
  }
  