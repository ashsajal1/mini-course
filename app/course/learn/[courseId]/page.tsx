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
      order: "asc",
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Course Learning Path</h1>
      <p className="text-base-content/70 mb-8">
        Follow the timeline below to track your progress through the course
      </p>

      {/* Timeline Container */}
      <div className="relative">
        {courseModules.map((module, index) => {
          const progress = userProgress.get(module.id);
          const isCompleted = progress?.isCompleted || false;
          const isNextModule = module.id === nextModuleId;
          const isLast = index === courseModules.length - 1;

          return (
            <div key={module.id} className="relative pb-12">
              {/* Timeline Line */}
              {!isLast && (
                <div
                  className={`absolute left-6 top-14 w-0.5 h-full -ml-px ${
                    isCompleted ? "bg-success" : "bg-base-300"
                  }`}
                />
              )}

              {/* Timeline Item */}
              <div className="relative flex items-start gap-6">
                {/* Timeline Marker */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 ${
                      isCompleted
                        ? "bg-success text-success-content"
                        : isNextModule
                        ? "bg-primary text-primary-content ring-4 ring-primary/30 animate-pulse"
                        : "bg-base-300 text-base-content/50"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>

                {/* Module Content Card */}
                <div
                  className={`flex-1 card bg-base-100 shadow-lg transition-all hover:shadow-xl ${
                    isNextModule ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="card-body">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="card-title text-xl flex-1">
                        {module.title}
                      </h2>
                      <div className="flex flex-col gap-2">
                        {isCompleted && (
                          <div className="badge badge-success gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Completed
                          </div>
                        )}
                        {isNextModule && !isCompleted && (
                          <div className="badge badge-primary gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Up Next
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Module Info */}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-base-content/70">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>
                          {module._count.slides}{" "}
                          {module._count.slides === 1 ? "slide" : "slides"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Updated{" "}
                          {new Date(module.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Completion Date */}
                    {isCompleted && progress?.completedAt && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-success">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Completed on{" "}
                          {new Date(progress.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="card-actions justify-end mt-4">
                      <Link href={`/course/learn/${courseId}/${module.id}`}>
                        <button
                          className={`btn ${
                            isNextModule
                              ? "btn-primary gap-2"
                              : isCompleted
                              ? "btn-outline btn-success gap-2"
                              : "btn-ghost gap-2"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Review Module
                            </>
                          ) : isNextModule ? (
                            <>
                              Continue Learning
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </>
                          ) : (
                            <>
                              Start Module
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
