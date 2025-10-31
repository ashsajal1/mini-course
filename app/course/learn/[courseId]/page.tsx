import prisma from "@/app/lib/client";
import Link from "next/link";

export default async function page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const courseModules = await prisma.module.findMany({
    where: {
      course_id: courseId,
    },
    select: {
      id: true,
      title: true,
    },
  });
  return (
    <div>
      {courseModules.map((m) => (
        <Link href={`/course/learn/${courseId}/${m.id}`} key={m.id}>
          <button aria-label="Course module" className="btn btn-primary">
            {m.title}
          </button>
        </Link>
      ))}
    </div>
  );
}
