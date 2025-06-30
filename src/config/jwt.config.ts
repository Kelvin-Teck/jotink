export default class JwtConfig {
  private static instance: JwtConfig;
  
  public readonly accessTokenSecret: string;
  public readonly refreshTokenSecret: string;
  public readonly accessTokenExpiry: string;
  public readonly refreshTokenExpiry: string;
  public readonly issuer: string;
  public readonly audience: string;

  private constructor() {
    // Validate required environment variables
    this.accessTokenSecret = this.getRequiredEnvVar('ACCESS_TOKEN_SECRET');
    this.refreshTokenSecret = this.getRequiredEnvVar('REFRESH_TOKEN_SECRET');
    
    // Validate secrets are different and strong enough
    if (this.accessTokenSecret === this.refreshTokenSecret) {
      throw new Error('Access and refresh token secrets must be different');
    }
    
    if (this.accessTokenSecret.length < 32 || this.refreshTokenSecret.length < 32) {
      throw new Error('JWT secrets must be at least 32 characters long');
    }

    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXP || '1h';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXP || '7d';
    this.issuer = process.env.JWT_ISSUER || 'notes-app';
    this.audience = process.env.JWT_AUDIENCE || 'notes-app-users';
  }

  private getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Environment variable ${name} is required`);
    }
    return value;
  }

  public static getInstance(): JwtConfig {
    if (!JwtConfig.instance) {
      JwtConfig.instance = new JwtConfig();
    }
    return JwtConfig.instance;
  }
}