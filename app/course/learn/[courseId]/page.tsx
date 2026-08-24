import prisma from "@/prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  RotateCcw,
  Play,
  Trophy,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { name: true },
  });

  if (!course) {
    return { title: "Course Not Found" };
  }

  return {
    title: `Learning Path: ${course.name}`,
    description: `Track your progress in ${course.name}`,
  };
}

export default async function page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { userId: clerkId } = await auth();

  const courseModules = await prisma.module.findMany({
    where: {
      course_id: courseId,
      deleted_at: null,
    },
    select: {
      id: true,
      title: true,
      course_id: true,
      created_at: true,
      updated_at: true,
      _count: {
        select: { slides: true },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

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

  const nextModuleId = courseModules.find(
    (module) => !userProgress.get(module.id)?.isCompleted
  )?.id;

  const completedCount = courseModules.filter(
    (m) => userProgress.get(m.id)?.isCompleted
  ).length;
  const totalModules = courseModules.length;
  const progressPercent =
    totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const allCompleted = completedCount === totalModules && totalModules > 0;

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Back to Course */}
        <Link
          href={`/course/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Course Learning Path
          </h1>
          <p className="text-sm text-foreground/50 max-w-md mx-auto">
            Follow the modules below to track your progress through the course.
          </p>
        </div>

        {/* Progress Card */}
        <div className="card bg-card border border shadow-sm mb-8">
          <div className="card-body !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold">Your Progress</h3>
                <p className="text-xs text-foreground/40">
                  {completedCount} of {totalModules} modules completed
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {progressPercent}
                </span>
                <span className="text-sm text-foreground/40">%</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  allCompleted
                    ? "bg-gradient-to-r from-success to-success/80"
                    : "bg-gradient-to-r from-primary to-secondary"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {allCompleted && (
              <div className="flex items-center gap-2 mt-3 text-sm text-success font-medium">
                <Trophy className="h-4 w-4" />
                All modules completed!
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {courseModules.map((module, index) => {
            const progress = userProgress.get(module.id);
            const isCompleted = progress?.isCompleted || false;
            const isNextModule = module.id === nextModuleId;
            const isLast = index === courseModules.length - 1;

            return (
              <div key={module.id} className="relative pb-6 last:pb-0">
                {/* Timeline Line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-11 w-0.5 h-[calc(100%-2.75rem)] ${
                      isCompleted ? "bg-success/40" : "bg-muted"
                    }`}
                  />
                )}

                {/* Timeline Item */}
                <div className="relative flex items-start gap-4">
                  {/* Marker */}
                  <div className="flex-shrink-0 z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isCompleted
                          ? "bg-success text-success-content"
                          : isNextModule
                            ? "bg-primary text-primary-content ring-4 ring-primary/20"
                            : "bg-muted text-foreground/40"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 card border shadow-sm hover:shadow-md transition-all ${
                      isNextModule
                        ? "border-primary/30 bg-primary/[0.02]"
                        : isCompleted
                          ? "border-success/20 bg-card"
                          : "border bg-card"
                    }`}
                  >
                    <div className="card-body !p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-semibold text-sm leading-tight truncate">
                              {module.title}
                            </h2>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold uppercase tracking-wider">
                                <CheckCircle className="h-2.5 w-2.5" />
                                Done
                              </span>
                            )}
                            {isNextModule && !isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                                <Play className="h-2.5 w-2.5" />
                                Up Next
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-foreground/40">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {module._count.slides} slide
                              {module._count.slides !== 1 ? "s" : ""}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(
                                module.updated_at
                              ).toLocaleDateString()}
                            </span>
                            {isCompleted && progress?.completedAt && (
                              <span className="inline-flex items-center gap-1 text-success">
                                <CheckCircle className="h-3 w-3" />
                                {new Date(
                                  progress.completedAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <Link
                          href={`/course/learn/${courseId}/${module.id}`}
                          className="flex-shrink-0"
                        >
                          <button
                            className={`btn btn-xs gap-1 ${
                              isNextModule
                                ? "btn-primary"
                                : isCompleted
                                  ? "btn-outline btn-success"
                                  : "btn-ghost"
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <RotateCcw className="h-3 w-3" />
                                <span className="hidden sm:inline">Review</span>
                              </>
                            ) : isNextModule ? (
                              <>
                                <span>Continue</span>
                                <ArrowRight className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                <span>Start</span>
                                <ArrowRight className="h-3 w-3" />
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

        {courseModules.length === 0 && (
          <div className="card bg-card border border border-dashed">
            <div className="card-body items-center text-center !py-12">
              <BookOpen className="h-10 w-10 text-foreground/15 mb-2" />
              <p className="text-sm text-foreground/40">
                No modules in this course yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
