"use server";

import { revalidatePath } from "next/cache";
import { getFirstModuleId } from "@/lib/course-service";
import { enrollInCourse } from "@/lib/enrollment-service";
import { submitRating } from "@/lib/rating-service";

export async function handleEnrollment(courseId: string) {
  try {
    await enrollInCourse(courseId);

    // Get the first module ID to redirect to
    const firstModuleId = await getFirstModuleId(courseId);

    revalidatePath(`/course/${courseId}`);

    return {
      success: true,
      firstModuleId,
      error: null
    };
  } catch (error) {
    console.error("Enrollment error:", error);
    return {
      success: false,
      firstModuleId: null,
      error: error instanceof Error ? error.message : "Failed to enroll in course"
    };
  }
}

export async function handleRating(courseId: string, rating: number, review?: string) {
  try {
    await submitRating(courseId, rating, review);

    revalidatePath(`/course/${courseId}`);

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error("Rating error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit rating"
    };
  }
}