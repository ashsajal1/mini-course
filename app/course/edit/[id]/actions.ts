"use server";

import { Prisma, ContentType } from "@prisma/client";
import prisma from "@/prisma/client";
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
  } catch {
    return { success: false, error: "Failed to create module" };
  }
}

export async function updateQuestionContent(questionId: string, content: string) {
  try {
    const question = await prisma.question.update({
      where: { id: questionId },
      data: { content },
      include: { module: true },
    });
    revalidatePath(`/course/edit/module/${question.module_id}`);
    return { success: true, question };
  } catch {
    return { success: false, error: "Failed to update question" };
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
  } catch {
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
  } catch {
    return { success: false, error: "Failed to delete module" };
  }
}

// Slide Actions
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

    revalidatePath(`/course/edit/module/${moduleId}`);
    return {
      success: true,
      slide: {
        ...slide,
        content_item: contentItem,
      },
    };
  } catch (error) {
    console.error("Error creating slide:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create slide",
    };
  }
}

export async function updateSlide(
  slideId: string,
  title: string,
  content: string
) {
  try {
    const updatedSlide = await prisma.slide.update({
      where: { id: slideId },
      data: { title, content },
      include: { module: true },
    });

    revalidatePath(`/course/edit/module/${updatedSlide.module_id}`);
    return { success: true, slide: updatedSlide };
  } catch {
    return { success: false, error: "Failed to update slide" };
  }
}

export async function deleteSlide(slideId: string) {
  try {
    // First get the slide to get module_id for revalidation
    const slide = await prisma.slide.findUnique({
      where: { id: slideId },
      include: { content_item: true },
    });

    if (!slide) {
      return { success: false, error: "Slide not found" };
    }

    // Delete the slide and its associated content item in a transaction
    await prisma.$transaction([
      prisma.slide.delete({ where: { id: slideId } }),
      prisma.content.delete({ where: { id: slide.content_item_id } }),
    ]);

    revalidatePath(`/course/edit/module/${slide.module_id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete slide:", error);
    return { success: false, error: "Failed to delete slide" };
  }
}

// Question & Quiz Actions
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
        module: true,
      },
    });

    revalidatePath(`/course/edit/module/${moduleId}`);
    return { success: true, question };
  } catch{
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
  } catch {
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    // First get the question to get module_id for revalidation
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { content_item: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    // Delete the question, its options, and associated content item in a transaction
    await prisma.$transaction([
      prisma.option.deleteMany({ where: { questionId } }),
      prisma.question.delete({ where: { id: questionId } }),
      prisma.content.delete({ where: { id: question.content_item_id! } }), // Non-null assertion as we know it exists
    ]);

    revalidatePath(`/course/edit/module/${question.module_id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete question:", error);
    return { success: false, error: "Failed to delete question" };
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
  } catch {
    return { success: false, error: "Failed to reorder content" };
  }
}
