export const dynamic = "force-dynamic";
import CourseCard from "@/app/components/course/course-card";
import Link from "next/link";
import prisma from "@/prisma/client";

type CourseWithModuleCount = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  lang: string;
  thumbnail_url: string | null;
  category_id: string | null;
  module_count: bigint;
};

export default async function Home() {
  const courses: CourseWithModuleCount[] = await prisma.$queryRaw`
  SELECT c.id,
         c.name,
         c.description,
         c.difficulty,
         c.lang,
         c.thumbnail_url,
         c.category_id,
         COUNT(m.id) AS module_count
  FROM "Course" c
  JOIN "Module" m ON m.course_id = c.id
  GROUP BY c.id, c.name, c.description, c.difficulty, c.lang, c.thumbnail_url, c.category_id
  HAVING COUNT(m.id) >= 2;
  `;

  return (
    <div className="min-h-screen w-full bg-base-200/40">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-content">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative container mx-auto py-20 px-4 sm:px-6 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary-content/15 ring-1 ring-primary-content/20">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Mini Course Platform
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Learn Something New, One Mini Course at a Time
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-primary-content/90">
            A modern, interactive e-learning platform to browse, enroll in, and
            complete bite-sized courses. Track your progress, practice with
            hands-on content, and build real skills at your own pace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#courses" className="btn btn-accent btn-lg">
              Explore Courses
            </a>
            <Link
              href="/about"
              className="btn btn-outline btn-lg bg-transparent text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
            >
              Learn More
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: String(courses.length), label: "Published Courses" },
              { value: "Free", label: "To Get Started" },
              { value: "Self-paced", label: "Learning" },
              { value: "Anywhere", label: "Mobile Friendly" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-primary-content/5 ring-1 ring-primary-content/10 backdrop-blur"
              >
                <dt className="text-2xl font-bold">{stat.value}</dt>
                <dd className="text-xs text-primary-content/80">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Courses */}
      <div className="container mx-auto py-14 px-4 sm:px-6 md:px-8" id="courses">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-1">
              Start Learning
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Available Courses
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hand-picked, bite-sized courses to level up your skills.
            </p>
          </div>
          <Link href="/course" className="btn btn-ghost btn-sm">
            View all
          </Link>
        </header>

        {courses.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-base-100 ring-1 ring-base-300">
            <h2 className="text-xl font-medium text-muted-foreground">
              No courses found
            </h2>
            <p className="mt-2 text-muted-foreground">
              Check back later for new courses!
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                lang={course.lang || "en"}
                title={course.name}
                description={course.description}
                difficulty={course.difficulty}
                thumbnail_url={course.thumbnail_url!}
                moduleCount={Number(course.module_count)}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
