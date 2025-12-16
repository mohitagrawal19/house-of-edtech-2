import { NextApiRequest, NextApiResponse } from 'next';
import { JWTPayload, verifyToken, extractToken } from './jwt';
import logger from './logger';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate requests using JWT
 */
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void> | void
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = extractToken(req.headers.authorization);

      if (!token) {
        logger.warn('Request without authentication token');
        return res.status(401).json({
          success: false,
          message: 'Authentication token required',
        });
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        logger.warn('Invalid or expired token');
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }

      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      logger.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
    }
  };
}

/**
 * Middleware to check user authorization based on role
 */
export function withAuthorization(...allowedRoles: string[]) {
  return (
    handler: (
      req: AuthenticatedRequest,
      res: NextApiResponse
    ) => Promise<void> | void
  ) => {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Unauthorized access attempt by user ${req.user?.userId} with role ${req.user?.role}`
        );
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      return handler(req, res);
    });
  };
}
