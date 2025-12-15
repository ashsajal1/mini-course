"use server";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

/**
 * Gets all ratings for a course
 */
export async function getCourseRatings(courseId: string) {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        course_id: courseId,
      },
      include: {
        user: {
          select: {
            clerk_id: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return ratings;
  } catch (error) {
    console.warn("Rating functionality not available:", error);
    return [];
  }
}

/**
 * Gets the average rating for a course
 */
export async function getAverageRating(courseId: string) {
  try {
    const result = await prisma.rating.aggregate({
      where: {
        course_id: courseId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating,
    };
  } catch (error) {
    console.warn("Rating functionality not available:", error);
    return { average: 0, count: 0 };
  }
}

/**
 * Submits a rating for a course
 */
export async function submitRating(courseId: string, rating: number, review?: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("User not authenticated");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Find or create user
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

    // Check if user already rated this course
    const existingRating = await prisma.rating.findUnique({
      where: {
        user_id_course_id: {
          user_id: user.id,
          course_id: courseId,
        },
      },
    });

    if (existingRating) {
      // Update existing rating
      const updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
          review,
        },
      });
      return updatedRating;
    } else {
      // Create new rating
      const newRating = await prisma.rating.create({
        data: {
          user_id: user.id,
          course_id: courseId,
          rating,
          review,
        },
      });
      return newRating;
    }
  } catch (error) {
    console.warn("Rating functionality not available:", error);
    throw error;
  }
}

/**
 * Checks if a user has already rated a course
 */
export async function hasUserRatedCourse(courseId: string) {
  try {
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

    const rating = await prisma.rating.findFirst({
      where: {
        user_id: user.id,
        course_id: courseId,
      },
    });

    return !!rating;
  } catch (error) {
    console.warn("Rating functionality not available:", error);
    return false;
  }
}

/**
 * Gets user's rating for a course
 */
export async function getUserRatingForCourse(courseId: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return null;
    }

    const rating = await prisma.rating.findFirst({
      where: {
        user_id: user.id,
        course_id: courseId,
      },
    });

    return rating;
  } catch (error) {
    console.warn("Rating functionality not available:", error);
    return null;
  }
}