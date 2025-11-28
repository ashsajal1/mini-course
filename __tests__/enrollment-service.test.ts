import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  enrollInCourse,
  isEnrolledInCourse,
  getEnrolledCourses,
  getCourseEnrollmentCount,
  markCourseAsCompleted
} from '@/lib/enrollment-service';

// Mock the clerk auth function
const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

// Properly mock the prisma client using a factory function
vi.mock('@/prisma/client', () => {
  return {
    __esModule: true, // This ensures it's treated as an ES module
    default: {
      user: {
        findUnique: vi.fn(),
      },
      enrollment: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
    }
  };
});

describe('Enrollment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('enrollInCourse', () => {
    it('should successfully enroll a user in a course', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue({ id: 'db_user_123' });

      // Mock enrollment creation
      const mockEnrollment = {
        id: 'enrollment_123',
        user_id: 'db_user_123',
        course_id: 'course_123',
      };
      prisma.enrollment.create.mockResolvedValue(mockEnrollment);

      const result = await enrollInCourse('course_123');

      expect(result).toEqual(mockEnrollment);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_user_123' },
      });
      expect(prisma.enrollment.create).toHaveBeenCalledWith({
        data: {
          user_id: 'db_user_123',
          course_id: 'course_123',
        },
      });
    });

    it('should throw an error if user is not authenticated', async () => {
      // Mock auth to return null user ID
      mockAuth.mockResolvedValue({ userId: null });

      await expect(enrollInCourse('course_123')).rejects.toThrow('User not authenticated');
    });

    it('should throw an error if user is not found in the database', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup to return null
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(enrollInCourse('course_123')).rejects.toThrow('User not found');
    });
  });

  describe('isEnrolledInCourse', () => {
    it('should return true if user is enrolled in a course', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue({ id: 'db_user_123' });

      // Mock enrollment lookup to find an enrollment
      prisma.enrollment.findFirst.mockResolvedValue({ id: 'enrollment_123' });

      const result = await isEnrolledInCourse('course_123');

      expect(result).toBe(true);
    });

    it('should return false if user is not enrolled in a course', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue({ id: 'db_user_123' });

      // Mock enrollment lookup to return null
      prisma.enrollment.findFirst.mockResolvedValue(null);

      const result = await isEnrolledInCourse('course_123');

      expect(result).toBe(false);
    });

    it('should return false if user is not authenticated', async () => {
      // Mock auth to return null user ID
      mockAuth.mockResolvedValue({ userId: null });

      const result = await isEnrolledInCourse('course_123');

      expect(result).toBe(false);
    });

    it('should return false if user is not found in the database', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup to return null
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await isEnrolledInCourse('course_123');

      expect(result).toBe(false);
    });
  });

  describe('getEnrolledCourses', () => {
    it('should return enrolled courses for an authenticated user', async () => {
      const { default: prisma } = await import('@/prisma/client');

      const mockCourses = [
        {
          id: 'enrollment_123',
          course: {
            id: 'course_123',
            name: 'Test Course',
            description: 'Test Description',
            difficulty: 'Beginner',
            thumbnail_url: 'http://example.com/image.jpg',
          },
          enrolled_at: new Date(),
          is_completed: false,
        }
      ];

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue({ id: 'db_user_123' });

      // Mock enrollment lookup
      prisma.enrollment.findMany.mockResolvedValue(mockCourses);

      const result = await getEnrolledCourses();

      expect(result).toEqual([
        {
          id: 'course_123',
          name: 'Test Course',
          description: 'Test Description',
          difficulty: 'Beginner',
          thumbnail_url: 'http://example.com/image.jpg',
          enrolled_at: mockCourses[0].enrolled_at,
          is_completed: false,
        }
      ]);
    });

    it('should return an empty array if user is not authenticated', async () => {
      // Mock auth to return null user ID
      mockAuth.mockResolvedValue({ userId: null });

      const result = await getEnrolledCourses();

      expect(result).toEqual([]);
    });
  });

  describe('getCourseEnrollmentCount', () => {
    it('should return the correct enrollment count for a course', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock enrollment count
      prisma.enrollment.count.mockResolvedValue(5);

      const result = await getCourseEnrollmentCount('course_123');

      expect(result).toBe(5);
      expect(prisma.enrollment.count).toHaveBeenCalledWith({
        where: {
          course_id: 'course_123',
        },
      });
    });
  });

  describe('markCourseAsCompleted', () => {
    it('should mark a course as completed for an enrolled user', async () => {
      const { default: prisma } = await import('@/prisma/client');

      const mockEnrollment = {
        id: 'enrollment_123',
        user_id: 'db_user_123',
        course_id: 'course_123',
        is_completed: false,
      };

      const mockUpdatedEnrollment = {
        ...mockEnrollment,
        is_completed: true,
        completed_at: new Date(),
      };

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue({ id: 'db_user_123' });

      // Mock enrollment lookup to find the enrollment
      prisma.enrollment.findFirst.mockResolvedValue(mockEnrollment);

      // Mock enrollment update
      prisma.enrollment.update.mockResolvedValue(mockUpdatedEnrollment);

      const result = await markCourseAsCompleted('course_123');

      expect(result).toEqual(mockUpdatedEnrollment);
      expect(prisma.enrollment.update).toHaveBeenCalledWith({
        where: {
          id: 'enrollment_123',
        },
        data: {
          is_completed: true,
          completed_at: expect.any(Date),
        },
      });
    });

    it('should throw an error if user is not authenticated', async () => {
      // Mock auth to return null user ID
      mockAuth.mockResolvedValue({ userId: null });

      await expect(markCourseAsCompleted('course_123')).rejects.toThrow('User not authenticated');
    });

    it('should throw an error if user is not enrolled in the course', async () => {
      const { default: prisma } = await import('@/prisma/client');

      // Mock auth to return a user ID
      mockAuth.mockResolvedValue({ userId: 'clerk_user_123' });

      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue({ id: 'db_user_123' });

      // Mock enrollment lookup to return null
      prisma.enrollment.findFirst.mockResolvedValue(null);

      await expect(markCourseAsCompleted('course_123')).rejects.toThrow('User is not enrolled in this course');
    });
  });
});