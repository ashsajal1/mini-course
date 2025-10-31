"use server";

import prisma from "@/app/lib/client";
import { revalidatePath } from "next/cache";

// Module Actions
export async function createModule(courseId: string, title: string) {
  try {
    const newMdoule = await prisma.module.create({
      data: {
        title,
        course_id: courseId,
      },
    });
    revalidatePath(`/course/edit/${courseId}`);
    return { success: true, newMdoule };
  } catch (error) {
    return { success: false, error: "Failed to create module" };
  }
}

export async function updateModule(moduleId: string, title: string) {
  try {
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: { title },
    });
    revalidatePath(`/course/edit/${updatedModule.course_id}`);
    return { success: true, module: updatedModule };
  } catch (error) {
    return { success: false, error: "Failed to update module" };
  }
}

export async function deleteModule(moduleId: string) {
  try {
    // First get the module to get course_id for revalidation
    const deletedModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { course_id: true },
    });

    if (!deletedModule) {
      return { success: false, error: "Module not found" };
    }

    await prisma.module.delete({
      where: { id: moduleId },
    });

    revalidatePath(`/course/edit/${deletedModule.course_id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete module" };
  }
}

// Slide Actions
export async function createSlide(moduleId: string, content: string) {
  try {
    // First create the content item
    const contentItem = await prisma.content.create({
      data: {
        type: "SLIDE",
        module_id: moduleId,
        order: await getNextOrder(moduleId),
      },
    });

    // Then create the slide
    const slide = await prisma.slide.create({
      data: {
        content,
        module_id: moduleId,
        content_item_id: contentItem.id,
      },
      include: { content_item: true },
    });

    revalidatePath(`/course/edit/module/${moduleId}`);
    return { success: true, slide };
  } catch (error) {
    return { success: false, error: "Failed to create slide" };
  }
}

export async function updateSlide(slideId: string, content: string) {
  try {
    const updatedSlide = await prisma.slide.update({
      where: { id: slideId },
      data: { content },
      include: { module: true },
    });

    revalidatePath(`/course/edit/module/${updatedSlide.module_id}`);
    return { success: true, slide: updatedSlide };
  } catch (error) {
    return { success: false, error: "Failed to update slide" };
  }
}

// Question & Quiz Actions
export async function createQuestion(
  moduleId: string,
  content: string,
  options: { text: string; isCorrect: boolean; explanation?: string }[]
) {
  try {
    // First create the content item
    const contentItem = await prisma.content.create({
      data: {
        type: "QUESTION",
        module_id: moduleId,
        order: await getNextOrder(moduleId),
      },
    });

    // Create the question with options
    const question = await prisma.question.create({
      data: {
        content,
        module_id: moduleId,
        content_item_id: contentItem.id,
        options: {
          create: options.map((opt) => ({
            text: opt.text,
            is_correct: opt.isCorrect,
            explanation: opt.explanation || null,
          })),
        },
      },
      include: {
        options: true,
        module: true,
      },
    });

    revalidatePath(`/course/edit/module/${moduleId}`);
    return { success: true, question };
  } catch (error) {
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateQuestion(
  questionId: string,
  content: string,
  options: {
    id?: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[]
) {
  try {
    // First update the question
    const question = await prisma.question.update({
      where: { id: questionId },
      data: { content },
      include: { module: true },
    });

    // Then update options (delete all and recreate for simplicity)
    await prisma.option.deleteMany({
      where: { questionId: questionId },
    });

    const optionsArr = options.map((opt) => ({
      questionId: questionId,
      text: opt.text,
      is_correct: opt.isCorrect,
      explanation: opt.explanation || null,
    }));
    await prisma.option.createMany({
      data: optionsArr,
    });

    revalidatePath(`/course/edit/module/${question.module_id}`);
    return { success: true, question };
  } catch (error) {
    return { success: false, error: "Failed to update question" };
  }
}

// Helper function to get the next order number for content items
async function getNextOrder(moduleId: string): Promise<number> {
  const lastItem = await prisma.content.findFirst({
    where: { module_id: moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return (lastItem?.order || 0) + 1;
}

// Reorder content items
export async function reorderContent(moduleId: string, contentIds: string[]) {
  try {
    await prisma.$transaction(
      contentIds.map((id, index) =>
        prisma.content.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath(`/course/edit/module/${moduleId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reorder content" };
  }
}
