import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CourseProgressSection } from "../components/profile/course-progress-section";
import { CreatedCoursesSection } from "../components/profile/created-courses-section";
import { LogoutButton } from "../components/auth/logout-button";
import { getEnrolledCourses } from "@/lib/enrollment-service";
import { SavedCoursesSection } from "../components/profile/saved-courses-section";
import type { Metadata } from "next";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";

export const metadata: Metadata = {
  title: "My Profile",
};

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

  // Fetch enrolled courses using the new enrollment service
  const enrolledCourses = await getEnrolledCourses();

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

  // Check admin status
  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="min-h-screen bg-muted p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="shadow-xl">
          <CardContent className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left p-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-background ring-offset-2">
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
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="default" size="lg">
                  {dbUser.level}
                </Badge>
                <Badge variant="secondary" size="lg">
                  {dbUser.xp} XP
                </Badge>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col gap-2">
              {isAdmin && (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              )}
              <LogoutButton />
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stats shadow bg-card w-full">
            <div className="stat">
              <div className="stat-title">Courses Enrolled</div>
              <div className="stat-value text-primary">
                {enrolledCourses.length}
              </div>
            </div>
          </div>
          <div className="stats shadow bg-card w-full">
            <div className="stat">
              <div className="stat-title">Courses in Progress</div>
              <div className="stat-value text-primary">{courses.length}</div>
            </div>
          </div>
          <div className="stats shadow bg-card w-full">
            <div className="stat">
              <div className="stat-title">Modules Completed</div>
              <div className="stat-value text-secondary">
                {dbUser.modules_progress.filter((p) => p.is_completed).length}
              </div>
            </div>
          </div>
          <div className="stats shadow bg-card w-full">
            <div className="stat">
              <div className="stat-title">Total XP</div>
              <div className="stat-value text-accent">{dbUser.xp}</div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
            {enrolledCourses.length === 0 ? (
              <p className="text-muted-foreground">
                You haven&apos;t enrolled in any courses yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="bg-muted">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex justify-end gap-2 mt-2">
                        <Badge variant="outline">
                          {course.difficulty}
                        </Badge>
                        {course.is_completed ? (
                          <Badge variant="success">Completed</Badge>
                        ) : (
                          <Badge variant="warning">In Progress</Badge>
                        )}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button asChild variant="primary" size="sm">
                          <a href={`/course/learn/${course.id}`}>
                            {course.is_completed ? "Review" : "Continue"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Courses Section */}
        <SavedCoursesSection />

        {/* Course Progress List - Shown Second */}
        <CourseProgressSection courses={courses} />

        {/* Created Courses Section */}
        <CreatedCoursesSection courses={createdCourses} />
      </div>
    </div>
  );
}
