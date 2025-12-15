import { z } from "zod";

export const courseFormSchema = z.object({
  name: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  difficulty: z
    .string()
    .refine((val) => ["Beginner", "Intermediate", "Advanced"].includes(val), {
      message: "Please select a valid difficulty level",
    }),

  lang: z
    .string()
    .min(2, "Language code must be at least 2 characters")
    .max(10, "Language code must be less than 10 characters"),

  category_id: z.string().optional(),

  thumbnail_url: z.string().optional().default(""),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;

// Validation functions
export function validateCourseData(data: unknown): {
  success: boolean;
  data?: CourseFormData;
  error?: string;
} {
  try {
    const result = courseFormSchema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      // Return the first validation error message
      const error = result.error.issues[0]?.message || "Validation failed";
      return { success: false, error };
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}
