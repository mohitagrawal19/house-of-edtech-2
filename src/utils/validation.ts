import { z } from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import logger from '@/lib/logger';

// Initialize DOMPurify for Node.js
const window = new JSDOM('').window as unknown as Window;
const sanitize = DOMPurify(window).sanitize;

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  const cleaned = sanitize(input, { ALLOWED_TAGS: [] });
  return cleaned.trim();
}

/**
 * Sanitize HTML content while allowing safe tags
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  return sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

/**
 * Validation schemas using Zod
 */

export const AuthSchemas = {
  register: z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .transform(sanitizeInput),
      email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .transform(sanitizeInput),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
      role: z.enum(['student', 'instructor']).default('student'),
    })
    .strict(),

  login: z
    .object({
      email: z.string().email('Invalid email address').toLowerCase(),
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
};

export const CourseSchemas = {
  create: z
    .object({
      title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title cannot exceed 200 characters')
        .transform(sanitizeInput),
      description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description cannot exceed 5000 characters')
        .transform(sanitizeHTML),
      category: z.enum([
        'programming',
        'web-development',
        'data-science',
        'design',
        'business',
        'other',
      ]),
      level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
      price: z
        .number()
        .min(0, 'Price cannot be negative')
        .max(999999, 'Price is too high'),
      modules: z
        .array(
          z.object({
            title: z
              .string()
              .min(3, 'Module title is required')
              .transform(sanitizeInput),
            description: z.string().transform(sanitizeHTML),
            duration: z.number().min(0),
            lessons: z
              .array(
                z.object({
                  title: z.string().min(1).transform(sanitizeInput),
                  content: z.string().transform(sanitizeHTML),
                  duration: z.number().min(0),
                  videoUrl: z.string().url().optional(),
                })
              )
              .optional(),
          })
        )
        .optional(),
    })
    .strict(),

  update: z
    .object({
      title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title cannot exceed 200 characters')
        .transform(sanitizeInput)
        .optional(),
      description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description cannot exceed 5000 characters')
        .transform(sanitizeHTML)
        .optional(),
      category: z
        .enum([
          'programming',
          'web-development',
          'data-science',
          'design',
          'business',
          'other',
        ])
        .optional(),
      level: z
        .enum(['beginner', 'intermediate', 'advanced'])
        .optional(),
      price: z
        .number()
        .min(0, 'Price cannot be negative')
        .max(999999, 'Price is too high')
        .optional(),
    })
    .strict(),

  enroll: z
    .object({
      courseId: z.string().min(1, 'Course ID is required'),
    })
    .strict(),
};

/**
 * Validate and transform data
 */
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      logger.warn('Validation error:', errors);
      return { success: false, errors };
    }

    logger.error('Validation error:', error);
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Type-safe validation helper
 */
export async function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new Error(errorMessages);
    }
    throw error;
  }
}
