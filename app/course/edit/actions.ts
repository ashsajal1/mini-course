"use server";

import prisma from "@/app/lib/client";

export const getCourses = async () => {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  return courses;
};
