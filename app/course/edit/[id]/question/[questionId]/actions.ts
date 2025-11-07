"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function getQuestion(questionId: string) {
  return await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      options: true,
    },
  });
}

type Option = {
  id?: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
};

export async function updateQuestion(
  questionId: string,
  courseId: string,
  title: string,
  question: string,
  options: Option[]
) {
  try {
    // Validate that there is exactly one correct answer
    const correctOptionsCount = options.filter(opt => opt.isCorrect).length;
    if (correctOptionsCount !== 1) {
      return { success: false, message: "There must be exactly one correct answer." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.question.update({
        where: { id: questionId },
        data: {
          title,
          content: question,
        },
      });

      // Separate options into new and existing
      const newOptions = options.filter((opt) => !opt.id);
      const existingOptions = options.filter((opt) => opt.id);

      // Create new options
      if (newOptions.length > 0) {
        await tx.option.createMany({
          data: newOptions.map((opt) => ({
            questionId,
            text: opt.text,
            isCorrect: opt.isCorrect,
            explanation: opt.explanation,
          })),
        });
      }
      
      // Update existing options
      for (const option of existingOptions) {
        await tx.option.update({
          where: { id: option.id },
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
            explanation: option.explanation,
          },
        });
      }

      // Delete options that are not in the submission
      const optionIdsToKeep = existingOptions.map(opt => opt.id as string).filter(id => id);
      await tx.option.deleteMany({
        where: {
          questionId,
          id: {
            notIn: optionIdsToKeep,
          },
        },
      });
    });

    revalidatePath(`/course/edit/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update question:", error);
    let message = "Failed to update question.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { success: false, message };
  }
}