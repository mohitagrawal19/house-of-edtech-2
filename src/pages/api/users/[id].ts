import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/mongodb';
import { successResponse, errorResponse, asyncHandler } from '@/utils/response';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { generalLimiter } from '@/lib/rateLimiter';
import logger from '@/lib/logger';
import { Types } from 'mongoose';

/**
 * Get current user profile
 * GET /api/users/me
 */
async function getCurrentUser(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    await connectDB();

    const user = await User.findById(req.user?.userId)
      .populate('enrolledCourses', 'title category price')
      .populate('createdCourses', 'title category price');

    if (!user) {
      errorResponse(res, 404, 'User not found');
      return;
    }

    successResponse(res, user);
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    errorResponse(res, 500, 'Failed to fetch user profile');
  }
}

/**
 * Update user profile
 * PUT /api/users/me
 */
async function updateProfile(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'PUT') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    const { name, bio, avatar } = req.body;

    // Validate input
    if (name && (typeof name !== 'string' || name.length < 2 || name.length > 100)) {
      errorResponse(res, 400, 'Invalid name');
      return;
    }

    if (bio && (typeof bio !== 'string' || bio.length > 500)) {
      errorResponse(res, 400, 'Invalid bio');
      return;
    }

    await connectDB();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`User profile updated: ${req.user?.userId}`);

    successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    logger.error('Error updating profile:', error);
    errorResponse(res, 500, 'Failed to update profile');
  }
}

/**
 * Get user by ID
 * GET /api/users/[id]
 */
async function getUserById(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      errorResponse(res, 400, 'Invalid user ID');
      return;
    }

    await connectDB();

    const user = await User.findById(id)
      .select('-password')
      .populate('createdCourses', 'title category rating');

    if (!user) {
      errorResponse(res, 404, 'User not found');
      return;
    }

    successResponse(res, user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    errorResponse(res, 500, 'Failed to fetch user');
  }
}

/**
 * Main handler
 */
export default asyncHandler(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  // Apply rate limiting
  await new Promise<void>((resolve, reject) => {
    generalLimiter(req as any, res as any, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  // Check if it's a specific user ID route
  const { id } = req.query;

  if (id === 'me') {
    // Current user endpoints
    if (req.method === 'GET' || req.method === 'PUT') {
      await withAuth(async (req: AuthenticatedRequest, res: NextApiResponse): Promise<void> => {
        if (req.method === 'GET') {
          await getCurrentUser(req, res);
        } else if (req.method === 'PUT') {
          await updateProfile(req, res);
        }
      })(req as AuthenticatedRequest, res);
    } else {
      errorResponse(res, 405, 'Method not allowed');
    }
  } else if (id) {
    // Specific user profile
    await getUserById(req, res);
  } else {
    errorResponse(res, 405, 'Method not allowed');
  }
});
