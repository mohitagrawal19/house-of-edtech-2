import { NextApiRequest, NextApiResponse } from 'next';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/mongodb';
import { validateData, CourseSchemas } from '@/utils/validation';
import { successResponse, errorResponse, asyncHandler } from '@/utils/response';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { generalLimiter } from '@/lib/rateLimiter';
import logger from '@/lib/logger';
import { Types } from 'mongoose';

/**
 * Get a specific course by ID
 * GET /api/courses/[id]
 */
async function getCourse(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      return errorResponse(res, 400, 'Invalid course ID');
    }

    await connectDB();

    const course = await Course.findById(id)
      .populate('instructor', 'name email avatar bio')
      .populate('students', 'name email avatar');

    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    return successResponse(res, course);
  } catch (error) {
    logger.error('Error fetching course:', error);
    return errorResponse(res, 500, 'Failed to fetch course');
  }
}

/**
 * Update a course
 * PUT /api/courses/[id]
 */
async function updateCourse(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      return errorResponse(res, 400, 'Invalid course ID');
    }

    // Validate input
    const validation = await validateData(CourseSchemas.update, req.body);

    if (!validation.success) {
      return errorResponse(res, 400, 'Validation failed', validation.errors);
    }

    await connectDB();

    const course = await Course.findById(id);

    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    // Check authorization - only course creator or admin can update
    if (
      course.instructor.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      logger.warn(
        `Unauthorized update attempt for course ${id} by user ${req.user?.userId}`
      );
      return errorResponse(res, 403, 'Not authorized to update this course');
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    logger.info(
      `Course updated: ${id} by user: ${req.user?.userId}`
    );

    return successResponse(res, updatedCourse, 'Course updated successfully');
  } catch (error) {
    logger.error('Error updating course:', error);
    return errorResponse(res, 500, 'Failed to update course');
  }
}

/**
 * Delete a course
 * DELETE /api/courses/[id]
 */
async function deleteCourse(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      return errorResponse(res, 400, 'Invalid course ID');
    }

    await connectDB();

    const course = await Course.findById(id);

    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    // Check authorization
    if (
      course.instructor.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      logger.warn(
        `Unauthorized delete attempt for course ${id} by user ${req.user?.userId}`
      );
      return errorResponse(res, 403, 'Not authorized to delete this course');
    }

    // Soft delete by marking isActive as false
    course.isActive = false;
    await course.save();

    // Remove course from instructor's createdCourses
    await User.findByIdAndUpdate(
      course.instructor,
      { $pull: { createdCourses: id } }
    );

    // Remove from all students' enrolled courses
    await User.updateMany(
      { enrolledCourses: id },
      { $pull: { enrolledCourses: id } }
    );

    logger.info(
      `Course deleted: ${id} by user: ${req.user?.userId}`
    );

    return successResponse(res, null, 'Course deleted successfully');
  } catch (error) {
    logger.error('Error deleting course:', error);
    return errorResponse(res, 500, 'Failed to delete course');
  }
}

/**
 * Enroll in a course
 * POST /api/courses/[id]/enroll
 */
async function enrollCourse(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      return errorResponse(res, 400, 'Invalid course ID');
    }

    await connectDB();

    const course = await Course.findById(id);

    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    if (!course.isActive) {
      return errorResponse(res, 400, 'Course is not available');
    }

    const userId = new Types.ObjectId(req.user?.userId);

    // Check if already enrolled
    if (course.students.includes(userId)) {
      return errorResponse(res, 400, 'Already enrolled in this course');
    }

    // Add student to course
    course.students.push(userId);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(
      userId,
      { $push: { enrolledCourses: id } },
      { new: true }
    );

    logger.info(
      `User ${req.user?.userId} enrolled in course: ${id}`
    );

    return successResponse(res, null, 'Successfully enrolled in course', 201);
  } catch (error) {
    logger.error('Error enrolling in course:', error);
    return errorResponse(res, 500, 'Failed to enroll in course');
  }
}

/**
 * Main handler
 */
export default asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  // Apply rate limiting
  await new Promise<void>((resolve, reject) => {
    generalLimiter(req as any, res as any, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const { action } = req.query;

  if (req.method === 'GET') {
    return getCourse(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateCourse)(req as AuthenticatedRequest, res);
  } else if (req.method === 'DELETE') {
    return withAuth(deleteCourse)(req as AuthenticatedRequest, res);
  } else if (req.method === 'POST' && action === 'enroll') {
    return withAuth(enrollCourse)(req as AuthenticatedRequest, res);
  }

  return errorResponse(res, 405, 'Method not allowed');
});
