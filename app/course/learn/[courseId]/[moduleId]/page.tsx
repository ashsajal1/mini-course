import prisma from "@/app/lib/client";
import { ContentType, type Prisma } from "@/app/generated/prisma/client";
import ModuleContent from "./module-content";

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
  const { moduleId } = await params;

  const moduleContent = await prisma.content.findMany({
    where: {
      module_id: moduleId,
      type: {
        in: [ContentType.SLIDE, ContentType.QUESTION]
      }
    },
    include: {
      slide: true,
      question: {
        include: {
          options: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div>
      {moduleContent.map((content) => (
        <ModuleContent
          key={content.id}
          content={content as ContentWithRelations}
        />
      ))}
    </div>
  );
}
