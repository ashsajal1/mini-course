"use server";

import { Prisma, ContentType } from "@prisma/client";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

// Helper function to get the next order number for content items
async function getNextOrder(moduleId: string): Promise<number> {
  const lastItem = await prisma.content.findFirst({
    where: { module_id: moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return (lastItem?.order || 0) + 1;
}

type SlideWithContentItem = Prisma.SlideGetPayload<{
  include: { content_item: true };
}>;

export async function createSlide(
  moduleId: string,
  title: string,
  content: string
): Promise<{
  success: boolean;
  slide?: SlideWithContentItem;
  error?: string;
}> {
  try {
    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { course_id: true },
    });

    if (!moduleData) {
      return { success: false, error: "Module not found" };
    }

    // First create the content item
    const contentItem = await prisma.content.create({
      data: {
        type: ContentType.SLIDE,
        module_id: moduleId,
        order: await getNextOrder(moduleId),
      },
    });

    // Then create the slide with the content_item_id
    const slide = await prisma.slide.create({
      data: {
        title: title,
        content: content,
        module_id: moduleId,
        content_item_id: contentItem.id,
      },
      include: {
        content_item: true,
      },
    });

    revalidatePath(`/course/edit/${moduleData.course_id}`);
    return {
      success: true,
      slide: slide,
    };
  } catch (error) {
    console.error("Error creating slide:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create slide",
    };
  }
}