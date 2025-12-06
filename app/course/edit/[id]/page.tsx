import prisma from "@/prisma/client";
import Modules from "./modules";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  Eye,
  Settings,
} from "lucide-react";

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
          content: {
            orderBy: { order: "asc" },
            include: {
              slide: {
                select: { id: true, title: true, content: true },
              },
              question: {
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
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-error" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Course Not Found</h1>
          <p className="text-base-content/70 mb-6">
            This course doesn&apos;t exist or has been deleted.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalSlides = course.modules.reduce(
    (sum, module) => sum + module.content.filter((c) => c.slide).length,
    0
  );
  const totalQuestions = course.modules.reduce(
    (sum, module) => sum + module.content.filter((c) => c.question).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-200 to-base-300">
      {/* Top Navigation Bar */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/course/learn/${course.id}`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <button className="btn btn-ghost btn-sm gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Course Info Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-7 h-7 text-primary-content" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg line-clamp-2">
                      {course.name}
                    </h2>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-base-content/60 uppercase tracking-wide mb-1">
                      Difficulty
                    </div>
                    <div
                      className={`badge ${
                        course.difficulty === "Beginner"
                          ? "badge-success"
                          : course.difficulty === "Intermediate"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {course.difficulty}
                    </div>
                  </div>

                  {course.description && (
                    <div>
                      <div className="text-xs text-base-content/60 uppercase tracking-wide mb-1">
                        Description
                      </div>
                      <p className="text-sm text-base-content/80 line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="font-bold text-sm text-base-content/70 uppercase tracking-wide mb-3">
                  Content Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Modules</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {course.modules.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-info" />
                      </div>
                      <span className="text-sm font-medium">Slides</span>
                    </div>
                    <span className="text-2xl font-bold text-info">
                      {totalSlides}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-sm font-medium">Questions</span>
                    </div>
                    <span className="text-2xl font-bold text-success">
                      {totalQuestions}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <Modules
                  modules={course.modules ?? []}
                  courseId={course.id ?? ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
