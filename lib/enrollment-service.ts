"use server"
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

/**
 * Enrolls a user in a course
 */
export async function enrollInCourse(courseId: string) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  // Find the user by clerk_id
  let user = await prisma.user.findUnique({
    where: { clerk_id: clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerk_id: clerkId,
      },
    });
  }

  // Check if user is already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      user_id_course_id: {
        user_id: user.id,
        course_id: courseId,
      },
    },
  });

  if (existingEnrollment) {
    return existingEnrollment;
  }

  // Create the enrollment record
  const enrollment = await prisma.enrollment.create({
    data: {
      user_id: user.id,
      course_id: courseId,
    },
  });

  return enrollment;
}

/**
 * Checks if a user is enrolled in a course
 */
export async function isEnrolledInCourse(courseId: string) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { clerk_id: clerkId },
  });

  if (!user) {
    return false;
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      user_id: user.id,
      course_id: courseId,
    },
  });

  return !!enrollment;
}

/**
 * Gets all courses a user is enrolled in
 */
export async function getEnrolledCourses() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { clerk_id: clerkId },
  });

  if (!user) {
    return [];
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      course: true,
    },
    orderBy: {
      enrolled_at: "desc",
    },
  });

  return enrollments.map(enrollment => ({
    id: enrollment.course.id,
    name: enrollment.course.name,
    description: enrollment.course.description,
    difficulty: enrollment.course.difficulty,
    thumbnail_url: enrollment.course.thumbnail_url,
    enrolled_at: enrollment.enrolled_at,
    is_completed: enrollment.is_completed,
  }));
}

/**
 * Gets enrollment count for a course
 */
export async function getCourseEnrollmentCount(courseId: string) {
  const count = await prisma.enrollment.count({
    where: {
      course_id: courseId,
    },
  });

  return count;
}

/**
 * Marks a course as completed for a user
 */
export async function markCourseAsCompleted(courseId: string) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerk_id: clerkId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      user_id: user.id,
      course_id: courseId,
    },
  });

  if (!enrollment) {
    throw new Error("User is not enrolled in this course");
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: {
      id: enrollment.id,
    },
    data: {
      is_completed: true,
      completed_at: new Date(),
    },
  });

  return updatedEnrollment;
}