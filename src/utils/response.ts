import { NextApiResponse } from 'next';
import logger from '@/lib/logger';

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp?: string;
}

/**
 * Send a successful API response
 */
export function successResponse<T>(
  res: NextApiResponse,
  data?: T,
  message: string = 'Success',
  statusCode: number = 200
): NextApiResponse {
  const response: APIResponse<T> = {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
}

/**
 * Send an error API response
 */
export function errorResponse(
  res: NextApiResponse,
  statusCode: number = 400,
  message: string = 'An error occurred',
  errors?: Record<string, string>
): NextApiResponse {
  const response: APIResponse = {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };

  logger.error(`API Error [${statusCode}]: ${message}`, errors);
  return res.status(statusCode).json(response);
}

/**
 * Handle API errors with logging
 */
export function handleError(
  res: NextApiResponse,
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred'
) {
  if (error instanceof Error) {
    logger.error('API Handler Error:', {
      message: error.message,
      stack: error.stack,
    });

    // Check for validation errors
    if (error.message.includes('Validation')) {
      return errorResponse(res, 400, error.message);
    }

    // Check for authorization errors
    if (error.message.includes('Unauthorized')) {
      return errorResponse(res, 401, error.message);
    }

    // Check for not found errors
    if (error.message.includes('not found')) {
      return errorResponse(res, 404, error.message);
    }

    return errorResponse(res, 500, defaultMessage);
  }

  logger.error('Unknown error:', error);
  return errorResponse(res, 500, defaultMessage);
}

/**
 * Wrapper for handling API route errors
 */
export function asyncHandler(
  fn: (req: any, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: any, res: NextApiResponse) => {
    try {
      await fn(req, res);
    } catch (error) {
      handleError(res, error);
    }
  };
}
