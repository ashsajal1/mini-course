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
    <div className="min-h-screen w-full bg-background">
      {/* Product Introduction Hero */}
      <section className="bg-primary text-primary-content">
        <div className="container mx-auto py-16 px-4 sm:px-6 md:px-8 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary-content/10">
            Mini Course Platform
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Learn Something New, One Mini Course at a Time
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg opacity-90">
            A modern, interactive e-learning platform to browse, enroll in, and
            complete bite-sized courses. Track your progress, practice with
            hands-on content, and build real skills at your own pace.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#courses" className="btn btn-accent">
              Explore Courses
            </a>
            <Link href="/about" className="btn btn-outline bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg bg-primary-content/5">
              <dt className="text-2xl font-bold">{courses.length}</dt>
              <dd className="text-xs opacity-80">Published Courses</dd>
            </div>
            <div className="p-4 rounded-lg bg-primary-content/5">
              <dt className="text-2xl font-bold">Free</dt>
              <dd className="text-xs opacity-80">To Get Started</dd>
            </div>
            <div className="p-4 rounded-lg bg-primary-content/5">
              <dt className="text-2xl font-bold">Self-paced</dt>
              <dd className="text-xs opacity-80">Learning</dd>
            </div>
            <div className="p-4 rounded-lg bg-primary-content/5">
              <dt className="text-2xl font-bold">Anywhere</dt>
              <dd className="text-xs opacity-80">Mobile Friendly</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8" id="courses">
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Courses
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse available courses
          </p>
        </header>

        {courses.length === 0 ? (
          <div className="text-center py-12">
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
