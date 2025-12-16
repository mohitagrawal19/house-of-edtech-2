import { NextApiRequest, NextApiResponse } from 'next';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/mongodb';
import { validateData, CourseSchemas } from '@/utils/validation';
import { successResponse, errorResponse, asyncHandler } from '@/utils/response';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { generalLimiter } from '@/lib/rateLimiter';
import logger from '@/lib/logger';

/**
 * Get all courses with filtering and pagination
 * GET /api/courses?page=1&limit=10&category=programming&search=react
 */
async function getCourses(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    await connectDB();

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.level) {
      filter.level = req.query.level;
    }

    // Get total count for pagination
    const total = await Course.countDocuments(filter);

    // Get courses with pagination
    const courses = await Course.find(filter)
      .select('-modules') // Exclude modules in list view
      .populate('instructor', 'name email avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching courses:', error);
    errorResponse(res, 500, 'Failed to fetch courses');
  }
}

/**
 * Create a new course
 * POST /api/courses
 */
async function createCourse(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    // Only instructors and admins can create courses
    if (!['instructor', 'admin'].includes(req.user?.role || '')) {
      errorResponse(res, 403, 'Only instructors can create courses');
      return;
    }

    // Validate input
    const validation = await validateData(CourseSchemas.create, req.body);

    if (!validation.success) {
      errorResponse(res, 400, 'Validation failed', validation.errors);
      return;
    }

    await connectDB();

    // Create course with authenticated user as instructor
    const course = new Course({
      ...validation.data,
      instructor: req.user?.userId,
    });

    await course.save();

    // Add course to user's created courses
    await User.findByIdAndUpdate(
      req.user?.userId,
      { $push: { createdCourses: course._id } },
      { new: true }
    );

    logger.info(
      `Course created: ${course._id} by instructor: ${req.user?.userId}`
    );

    successResponse(res, course, 'Course created successfully', 201);
  } catch (error) {
    logger.error('Error creating course:', error);
    errorResponse(res, 500, 'Failed to create course');
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

  if (req.method === 'GET') {
    await getCourses(req, res);
  } else if (req.method === 'POST') {
    await withAuth(createCourse)(req as AuthenticatedRequest, res);
  } else {
    errorResponse(res, 405, 'Method not allowed');
  }
});
