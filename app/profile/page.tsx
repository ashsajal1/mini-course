import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  PlayCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { CourseProgressSection } from "../components/profile/course-progress-section";
import { CreatedCoursesSection } from "../components/profile/created-courses-section";
import { LogoutButton } from "../components/auth/logout-button";
import { getEnrolledCourses } from "@/lib/enrollment-service";
import { SavedCoursesSection } from "../components/profile/saved-courses-section";
import type { Metadata } from "next";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-8">
        {/* Header Section */}
        <div className="rounded-2xl bg-card ring-1 ring-border shadow-xl shadow-primary/5 overflow-hidden">
          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 overflow-hidden">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 -left-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-20 right-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute top-4 right-1/3 h-20 w-20 rounded-full bg-white/15 blur-xl" />
              <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]" />
            </div>
            {/* Fade into card */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          <div className="px-6 pb-6 -mt-10">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 text-center md:text-left">
              <Image
                src={user.imageUrl}
                alt={user.fullName || "User"}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full ring-4 ring-card object-cover shadow-lg mx-auto md:mx-0"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                  {user.fullName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <span className="badge border-0 bg-primary/10 text-primary">
                    {dbUser.level}
                  </span>
                  <span className="badge border-0 bg-secondary/10 text-secondary">
                    {dbUser.xp} XP
                  </span>
                  {isAdmin && (
                    <span className="badge border-0 bg-warning/10 text-warning gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-row md:flex-col justify-center gap-2 shrink-0">
                {isAdmin && (
                  <Link href="/admin" className="btn btn-secondary btn-sm gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: BookOpen,
              label: "Courses Enrolled",
              value: enrolledCourses.length,
              iconClass: "bg-primary/10 text-primary",
            },
            {
              icon: PlayCircle,
              label: "In Progress",
              value: courses.length,
              iconClass: "bg-info/10 text-info",
            },
            {
              icon: Award,
              label: "Modules Completed",
              value: dbUser.modules_progress.filter((p) => p.is_completed).length,
              iconClass: "bg-success/10 text-success",
            },
            {
              icon: Zap,
              label: "Total XP",
              value: dbUser.xp,
              iconClass: "bg-warning/10 text-warning",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-card ring-1 ring-border p-4 sm:p-5 flex items-center gap-3.5 hover:shadow-md hover:shadow-primary/5 transition-shadow"
            >
              <span className={`grid place-items-center h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl ${stat.iconClass}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enrolled Courses Section */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Enrolled Courses</h2>
            <span className="text-sm text-muted-foreground">
              {enrolledCourses.length}{" "}
              {enrolledCourses.length === 1 ? "course" : "courses"}
            </span>
          </div>
          {enrolledCourses.length === 0 ? (
            <div className="rounded-2xl bg-card ring-1 ring-border p-10 text-center">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground mb-4">
                You haven&apos;t enrolled in any courses yet.
              </p>
              <Link href="/" className="btn btn-primary btn-sm gap-1.5 mx-auto">
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="group rounded-2xl bg-card ring-1 ring-border overflow-hidden flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-shadow"
                >
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {course.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-outline">{course.difficulty}</span>
                      {course.is_completed ? (
                        <span className="badge badge-success border-0">Completed</span>
                      ) : (
                        <span className="badge badge-warning border-0">In Progress</span>
                      )}
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <a
                      href={`/course/learn/${course.id}`}
                      className={`btn btn-sm w-full gap-1.5 ${
                        course.is_completed ? "btn-outline" : "btn-primary"
                      }`}
                    >
                      {course.is_completed ? "Review" : "Continue"}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
