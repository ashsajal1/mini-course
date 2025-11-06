import prisma from "@/prisma/client";
import Modules from "./modules";

export default async function ManageCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      modules: {
        include: {
          slides: {
            select: { id: true, title: true, content: true },
          },
          questions: {
            select: {
              id: true,
              title: true,
              content: true,
              options: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                  explanation: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return <div>
    <Modules modules={course?.modules ?? []} courseId={course?.id ?? ""} />
  </div>;
}
