import prisma from "@/prisma/client";
import { ContentType } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import LearnModuleView from "./learn-module-view";
import { getUserModuleProgress } from "./actions";

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
