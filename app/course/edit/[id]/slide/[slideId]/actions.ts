"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function getSlide(slideId: string) {
  return await prisma.slide.findUnique({
    where: { id: slideId },
  });
}

export async function updateSlide(
  slideId: string,
  courseId: string,
  title: string,
  content: string
) {
  try {
    await prisma.slide.update({
      where: { id: slideId },
      data: {
        title,
        content,
      },
    });

    revalidatePath(`/course/edit/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update slide:", error);
    return { success: false, message: "Failed to update slide." };
  }
}
