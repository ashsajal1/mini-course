import prisma from "@/prisma/client";
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
      deleted_at: null, // Only show non-deleted modules
    },
    select: {
      id: true,
      title: true,
      course_id: true,
      created_at: true,
      updated_at: true,
      // Get the count of slides for each module
      _count: {
        select: { slides: true },
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-6">Course Modules</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courseModules.map((module) => (
          <div key={module.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                {module.title}
              </h2>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {module._count.slides} {module._count.slides === 1 ? 'slide' : 'slides'} • 
                  Last updated: {new Date(module.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="card-actions justify-end mt-4">
                <Link href={`/course/learn/${courseId}/${module.id}`}>
                  <button className="btn btn-primary">
                    Start Module
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
