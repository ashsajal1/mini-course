"use server";

import prisma from "@/prisma/client";
import { validateCourseData } from "./course-validation";

type CreateCourseResponse = {
  success: boolean;
  error?: string;
  course?: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
    thumbnail_url: string;
    creator: string;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
  };
};

export async function createCourse(
  formData: FormData
): Promise<CreateCourseResponse> {
  try {
    // Convert FormData to plain object
    const formDataObj = Object.fromEntries(formData.entries());

    // Validate the form data using the common validation
    const validation = validateCourseData(formDataObj);

    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    // If validation passes, create the course
    const course = await prisma.course.create({
      data: validation.data!,
    });

    return { success: true, course }; // This line is a fallback in case redirect doesn't work
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create course",
    };
  }
}
