import rateLimit from 'express-rate-limit';

const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '900000'
);
const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || '100'
);

/**
 * General API rate limiter
 */
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.method === 'GET', // Skip rate limiting for GET requests
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return (req as any).user?.userId || req.ip || '';
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message:
    'Too many authentication attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Moderate rate limiter for data modification endpoints
 */
export const moderateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
