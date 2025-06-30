export interface IErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
    stack?: string;
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
  };
}

export interface ICustomError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  details?: any;
}
