import prisma from "@/prisma/client";
import { ContentType } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import LearnModuleView from "./learn-module-view";
import { getUserModuleProgress } from "./actions";
import { markCourseAsCompleted } from "@/lib/enrollment-service";
import { auth } from "@clerk/nextjs/server";

// This creates a type that includes the relations
export type ContentWithRelations = Prisma.ContentGetPayload<{
  include: {
    slide: {
      include: {
        content_item: true;
      };
    };
    question: {
      include: {
        options: true;
        content_item: true;
      };
    };
  };
}>;

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { moduleId, courseId } = await params;

  const moduleContent = await prisma.content.findMany({
    where: {
      module_id: moduleId,
      type: {
        in: [ContentType.SLIDE, ContentType.QUESTION],
      },
    },
    include: {
      slide: {
        include: {
          content_item: true,
        },
      },
      question: {
        include: {
          options: true,
          content_item: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  const progress = await getUserModuleProgress(moduleId);

  // Check if all modules in the course are completed, and mark course as completed if so
  if (progress.isCompleted) {
    const courseModules = await prisma.module.findMany({
      where: {
        course_id: courseId,
      },
      select: {
        id: true,
      },
    });

    const { userId: clerkId } = await auth();
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerk_id: clerkId },
      });

      if (user) {
        const userProgress = await prisma.userModuleProgress.findMany({
          where: {
            user_id: user.id,
            module_id: {
              in: courseModules.map(m => m.id),
            },
          },
        });

        // If all modules are completed, mark the course as completed
        if (userProgress.length === courseModules.length &&
            userProgress.every(p => p.is_completed)) {
          try {
            await markCourseAsCompleted(courseId);
          } catch (error) {
            console.error("Error marking course as completed:", error);
          }
        }
      }
    }
  }

  return (
    <div>
      <LearnModuleView
        moduleContent={moduleContent!}
        moduleId={moduleId}
        courseId={courseId}
        isCompleted={progress.isCompleted}
      />
    </div>
  );
}
