"use server";

import prisma from "@/prisma/client";

/**
 * Gets the first module ID for a course
 */
export async function getFirstModuleId(courseId: string) {
  const firstModule = await prisma.module.findFirst({
    where: {
      course_id: courseId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      id: true,
    },
  });

  return firstModule?.id || null;
}