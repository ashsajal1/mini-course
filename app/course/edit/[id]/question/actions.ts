"use server";

import { ContentType } from "@prisma/client";
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

// Get the content of the last slide in a module (for AI question generation)
export async function getPreviousSlideContent(moduleId: string): Promise<string | null> {
  try {
    // Find the last slide content item in the module
    const lastSlideContent = await prisma.content.findFirst({
      where: {
        module_id: moduleId,
        type: ContentType.SLIDE,
      },
      orderBy: { order: "desc" },
      include: {
        slide: {
          select: { content: true, title: true },
        },
      },
    });

    if (lastSlideContent?.slide) {
      const { title, content } = lastSlideContent.slide;
      return title ? `# ${title}\n\n${content}` : content;
    }

    return null;
  } catch (error) {
    console.error("Error fetching previous slide:", error);
    return null;
  }
}

export async function createQuestion(
  moduleId: string,
  title: string,
  question: string,
  options: Array<{
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>
) {
  try {
    // First create the content item
    const contentItem = await prisma.content.create({
      data: {
        type: ContentType.QUESTION,
        module_id: moduleId,
        order: await getNextOrder(moduleId),
      },
    });

    // Create the question with options
    const questionRecord = await prisma.question.create({
      data: {
        title,
        content: question,
        module_id: moduleId,
        content_item_id: contentItem.id,
        options: {
          create: options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            explanation: opt.explanation || null,
          })),
        },
      },
      include: {
        options: true,
        module: true, // include module to get course_id
      },
    });

    revalidatePath(`/course/edit/${questionRecord.module.course_id}`);
    return { success: true, question: questionRecord };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create question" };
  }
}