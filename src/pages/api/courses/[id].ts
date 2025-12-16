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
async function getCourse(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      errorResponse(res, 400, 'Invalid course ID');
      return;
    }

    await connectDB();

    const course = await Course.findById(id)
      .populate('instructor', 'name email avatar bio')
      .populate('students', 'name email avatar');

    if (!course) {
      errorResponse(res, 404, 'Course not found');
      return;
    }

    successResponse(res, course);
  } catch (error) {
    logger.error('Error fetching course:', error);
    errorResponse(res, 500, 'Failed to fetch course');
  }
}

/**
 * Update a course
 * PUT /api/courses/[id]
 */
async function updateCourse(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'PUT') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      errorResponse(res, 400, 'Invalid course ID');
      return;
    }

    // Validate input
    const validation = await validateData(CourseSchemas.update, req.body);

    if (!validation.success) {
      errorResponse(res, 400, 'Validation failed', validation.errors);
      return;
    }

    await connectDB();

    const course = await Course.findById(id);

    if (!course) {
      errorResponse(res, 404, 'Course not found');
      return;
    }

    // Check authorization - only course creator or admin can update
    if (
      course.instructor.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      logger.warn(
        `Unauthorized update attempt for course ${id} by user ${req.user?.userId}`
      );
      errorResponse(res, 403, 'Not authorized to update this course');
      return;
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    logger.info(
      `Course updated: ${id} by user: ${req.user?.userId}`
    );

    successResponse(res, updatedCourse, 'Course updated successfully');
  } catch (error) {
    logger.error('Error updating course:', error);
    errorResponse(res, 500, 'Failed to update course');
  }
}

/**
 * Delete a course
 * DELETE /api/courses/[id]
 */
async function deleteCourse(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'DELETE') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      errorResponse(res, 400, 'Invalid course ID');
      return;
    }

    await connectDB();

    const course = await Course.findById(id);

    if (!course) {
      errorResponse(res, 404, 'Course not found');
      return;
    }

    // Check authorization
    if (
      course.instructor.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      logger.warn(
        `Unauthorized delete attempt for course ${id} by user ${req.user?.userId}`
      );
      errorResponse(res, 403, 'Not authorized to delete this course');
      return;
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

    successResponse(res, null, 'Course deleted successfully');
  } catch (error) {
    logger.error('Error deleting course:', error);
    errorResponse(res, 500, 'Failed to delete course');
  }
}

/**
 * Enroll in a course
 * POST /api/courses/[id]/enroll
 */
async function enrollCourse(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    errorResponse(res, 405, 'Method not allowed');
    return;
  }

  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string)) {
      errorResponse(res, 400, 'Invalid course ID');
      return;
    }

    await connectDB();

    const course = await Course.findById(id);

    if (!course) {
      errorResponse(res, 404, 'Course not found');
      return;
    }

    if (!course.isActive) {
      errorResponse(res, 400, 'Course is not available');
      return;
    }

    const userId = new Types.ObjectId(req.user?.userId);

    // Check if already enrolled
    if (course.students.includes(userId)) {
      errorResponse(res, 400, 'Already enrolled in this course');
      return;
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

    successResponse(res, null, 'Successfully enrolled in course', 201);
  } catch (error) {
    logger.error('Error enrolling in course:', error);
    errorResponse(res, 500, 'Failed to enroll in course');
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

  const { action } = req.query;

  if (req.method === 'GET') {
    await getCourse(req, res);
  } else if (req.method === 'PUT') {
    await withAuth(updateCourse)(req as AuthenticatedRequest, res);
  } else if (req.method === 'DELETE') {
    await withAuth(deleteCourse)(req as AuthenticatedRequest, res);
  } else if (req.method === 'POST' && action === 'enroll') {
    await withAuth(enrollCourse)(req as AuthenticatedRequest, res);
  } else {
    errorResponse(res, 405, 'Method not allowed');
  }
});
