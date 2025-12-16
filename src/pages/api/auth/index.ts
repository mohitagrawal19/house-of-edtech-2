import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import { validateData, AuthSchemas } from '@/utils/validation';
import { successResponse, errorResponse, asyncHandler } from '@/utils/response';
import { authLimiter } from '@/lib/rateLimiter';
import logger from '@/lib/logger';

/**
 * User Registration
 * POST /api/auth/register
 */
async function handleRegister(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    // Validate input
    const validation = await validateData(AuthSchemas.register, req.body);

    if (!validation.success) {
      return errorResponse(res, 400, 'Validation failed', validation.errors);
    }

    const { name, email, password, role } = validation.data!;

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, 'User already exists with this email');
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      isVerified: true, // In production, implement email verification
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info(`New user registered: ${email} with role: ${role}`);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    logger.error('Registration error:', error);
    return errorResponse(res, 500, 'Registration failed');
  }
}

/**
 * User Login
 * POST /api/auth/login
 */
async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    // Validate input
    const validation = await validateData(AuthSchemas.login, req.body);

    if (!validation.success) {
      return errorResponse(res, 400, 'Validation failed', validation.errors);
    }

    const { email, password } = validation.data!;

    // Connect to database
    await connectDB();

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      logger.warn(`Login attempt for inactive user: ${email}`);
      return errorResponse(res, 403, 'Account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info(`User logged in: ${email}`);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'Login successful'
    );
  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, 500, 'Login failed');
  }
}

/**
 * Main handler with rate limiting
 */
export default asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  // Apply rate limiting
  await new Promise<void>((resolve, reject) => {
    authLimiter(req as any, res as any, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  if (req.method === 'POST') {
    const action = req.query.action as string;

    if (action === 'register') {
      return handleRegister(req, res);
    } else if (action === 'login') {
      return handleLogin(req, res);
    } else {
      return errorResponse(res, 400, 'Invalid action');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
});
