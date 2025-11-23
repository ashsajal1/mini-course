import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch or create Prisma user
  let dbUser = await prisma.user.findUnique({
    where: { clerk_id: user.id },
    include: {
      modules_progress: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerk_id: user.id,
        level: "BEGINNER",
        xp: 0,
      },
      include: {
        modules_progress: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
  }

  // Calculate course progress
  const courseProgress = new Map<
    string,
    {
      course: (typeof dbUser.modules_progress)[0]["module"]["course"];
      completedModules: number;
      totalModules: number;
    }
  >();

  // Get all unique course IDs from progress
  const courseIds = new Set(
    dbUser.modules_progress.map((p) => p.module.course_id)
  );

  // Fetch total module counts for these courses
  const coursesWithCounts = await prisma.course.findMany({
    where: {
      id: {
        in: Array.from(courseIds),
      },
    },
    include: {
      _count: {
        select: {
          modules: true,
        },
      },
    },
  });

  // Initialize map with course info and total counts
  coursesWithCounts.forEach((c) => {
    courseProgress.set(c.id, {
      course: c,
      completedModules: 0,
      totalModules: c._count.modules,
    });
  });

  // Count completed modules
  dbUser.modules_progress.forEach((p) => {
    if (p.is_completed && courseProgress.has(p.module.course_id)) {
      const progress = courseProgress.get(p.module.course_id)!;
      progress.completedModules += 1;
    }
  });

  const courses = Array.from(courseProgress.values());

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  width={96}
                  height={96}
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <div className="flex gap-2 mt-2">
                <div className="badge badge-primary badge-lg">
                  {dbUser.level}
                </div>
                <div className="badge badge-secondary badge-lg">
                  {dbUser.xp} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Courses in Progress</div>
              <div className="stat-value text-primary">{courses.length}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Modules Completed</div>
              <div className="stat-value text-secondary">
                {dbUser.modules_progress.filter((p) => p.is_completed).length}
              </div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Total XP</div>
              <div className="stat-value text-accent">{dbUser.xp}</div>
            </div>
          </div>
        </div>

        {/* Course Progress List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Learning</h2>
          {courses.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <p className="text-lg text-base-content/70">
                  You haven&apos;t started any courses yet.
                </p>
                <div className="mt-4">
                  <Link href="/" className="btn btn-primary">
                    Browse Courses
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {courses.map(({ course, completedModules, totalModules }) => {
                const percentage =
                  totalModules > 0
                    ? Math.round((completedModules / totalModules) * 100)
                    : 0;

                return (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}`}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <div className="card-body flex-row gap-6 items-center">
                      <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={course.thumbnail_url}
                          alt={course.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="card-title text-lg">{course.name}</h3>
                        <div className="mt-2 flex items-center gap-4">
                          <progress
                            className="progress progress-primary w-full"
                            value={percentage}
                            max="100"
                          ></progress>
                          <span className="font-bold text-primary">
                            {percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-base-content/60 mt-1">
                          {completedModules} / {totalModules} modules
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
