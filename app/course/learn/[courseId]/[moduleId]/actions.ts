"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { UserLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

const XP_PER_MODULE = 10;

// XP thresholds for level progression
const XP_THRESHOLDS = {
  BEGINNER: 0,
  INTERMEDIATE: 100,
  ADVANCED: 500,
  MASTER: 1000,
};

function calculateLevel(xp: number): UserLevel {
  if (xp >= XP_THRESHOLDS.MASTER) return UserLevel.MASTER;
  if (xp >= XP_THRESHOLDS.ADVANCED) return UserLevel.ADVANCED;
  if (xp >= XP_THRESHOLDS.INTERMEDIATE) return UserLevel.INTERMEDIATE;
  return UserLevel.BEGINNER;
}

export async function completeModule(
  moduleId: string,
  courseId: string
): Promise<{ success: boolean; xpEarned?: number; error?: string }> {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerk_id: clerkId,
          xp: 0,
          level: UserLevel.BEGINNER,
        },
      });
    }

    // Check if module is already completed
    const existingProgress = await prisma.userModuleProgress.findUnique({
      where: {
        user_id_module_id: {
          user_id: user.id,
          module_id: moduleId,
        },
      },
    });

    if (existingProgress?.is_completed) {
      return { success: true, xpEarned: 0 };
    }

    // Update or create progress
    await prisma.userModuleProgress.upsert({
      where: {
        user_id_module_id: {
          user_id: user.id,
          module_id: moduleId,
        },
      },
      update: {
        is_completed: true,
        completed_at: new Date(),
      },
      create: {
        user_id: user.id,
        module_id: moduleId,
        is_completed: true,
        completed_at: new Date(),
      },
    });

    // Award XP and update level
    const newXp = user.xp + XP_PER_MODULE;
    const newLevel = calculateLevel(newXp);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    revalidatePath(`/course/learn/${courseId}/${moduleId}`);

    return { success: true, xpEarned: XP_PER_MODULE };
  } catch (error) {
    console.error("Error completing module:", error);
    return { success: false, error: "Failed to complete module" };
  }
}

export async function getUserModuleProgress(moduleId: string): Promise<{
  isCompleted: boolean;
  completedAt?: Date | null;
}> {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { isCompleted: false };
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return { isCompleted: false };
    }

    const progress = await prisma.userModuleProgress.findUnique({
      where: {
        user_id_module_id: {
          user_id: user.id,
          module_id: moduleId,
        },
      },
    });

    return {
      isCompleted: progress?.is_completed ?? false,
      completedAt: progress?.completed_at,
    };
  } catch (error) {
    console.error("Error fetching module progress:", error);
    return { isCompleted: false };
  }
}
