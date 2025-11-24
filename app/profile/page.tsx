import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CourseProgressSection } from "./course-progress-section";
import { CreatedCoursesSection } from "./created-courses-section";
import { LogoutButton } from "./logout-button";

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

  // Fetch last 10 courses created by the user
  const createdCourses = await prisma.course.findMany({
    where: {
      creator: user.id,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 10,
    include: {
      _count: {
        select: {
          modules: true,
        },
      },
    },
  });

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
            <div>
              <LogoutButton />
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

        {/* Course Progress List - Shown First */}
        <CourseProgressSection courses={courses} />

        {/* Created Courses Section */}
        <CreatedCoursesSection courses={createdCourses} />
      </div>
    </div>
  );
}
