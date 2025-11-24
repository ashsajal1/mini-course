import prisma from "@/prisma/client";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { userId: clerkId } = await auth();

  // Fetch course modules
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
      created_at: "asc",
    },
  });

  // Fetch user progress if authenticated
  const userProgress: Map<
    string,
    { isCompleted: boolean; completedAt: Date | null }
  > = new Map();
  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
      include: {
        modules_progress: {
          where: {
            module_id: {
              in: courseModules.map((m) => m.id),
            },
          },
        },
      },
    });

    if (user) {
      user.modules_progress.forEach((progress) => {
        userProgress.set(progress.module_id, {
          isCompleted: progress.is_completed,
          completedAt: progress.completed_at,
        });
      });
    }
  }

  // Find the first incomplete module (next module to do)
  const nextModuleId = courseModules.find(
    (module) => !userProgress.get(module.id)?.isCompleted
  )?.id;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-6">Course Modules</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courseModules.map((module) => {
          const progress = userProgress.get(module.id);
          const isCompleted = progress?.isCompleted || false;
          const isNextModule = module.id === nextModuleId;

          return (
            <div
              key={module.id}
              className={`card bg-base-100 shadow-xl relative ${
                isNextModule ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h2 className="card-title flex-1">{module.title}</h2>
                  {isCompleted && (
                    <div className="badge badge-success gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-4 h-4 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Completed
                    </div>
                  )}
                </div>
                {isNextModule && !isCompleted && (
                  <div className="badge badge-primary gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-4 h-4 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      ></path>
                    </svg>
                    Next Module
                  </div>
                )}
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    {module._count.slides}{" "}
                    {module._count.slides === 1 ? "slide" : "slides"} • Last
                    updated: {new Date(module.updated_at).toLocaleDateString()}
                  </span>
                </div>
                {isCompleted && progress?.completedAt && (
                  <div className="text-sm text-success">
                    Completed:{" "}
                    {new Date(progress.completedAt).toLocaleDateString()}
                  </div>
                )}
                <div className="card-actions justify-end mt-4">
                  <Link href={`/course/learn/${courseId}/${module.id}`}>
                    <button
                      className={`btn ${
                        isNextModule
                          ? "btn-primary"
                          : isCompleted
                          ? "btn-outline"
                          : "btn-primary"
                      }`}
                    >
                      {isCompleted ? "Review Module" : "Start Module"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
