import prisma from "@/app/lib/client";
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
      modules: true,
    },
  });
  return <div>
    <Modules modules={course?.modules ?? []} courseId={course?.id ?? ""} />
  </div>;
}
