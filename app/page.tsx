export const dynamic = "force-dynamic";
import CourseCard from "@/app/components/course/course-card";
import Link from "next/link";
import prisma from "@/prisma/client";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

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
      <section className="relative overflow-hidden bg-base-100">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Mini Course Platform
              </span>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6">
                Turn any doc into{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    bite-sized lessons with AI in clicks
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 200 12"
                    className="absolute -bottom-2 left-0 w-full h-3 text-accent"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9 C 60 2, 140 2, 198 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-muted-foreground mb-8">
                Paste a link to any documentation, blog, or article — or upload
                your own documents — and AI converts them into short, easy to
                learn concepts. Then track your progress as you master them.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                <a href="#courses" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25">
                  Explore Courses
                  <ArrowRight className="h-5 w-5" />
                </a>
                <Link href="/about" className="btn btn-outline btn-lg">
                  Learn More
                </Link>
              </div>

              <dl className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4">
                {[
                  { value: String(courses.length), label: "Published courses" },
                  { value: "Free", label: "To get started" },
                  { value: "Self-paced", label: "Learning" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <dt className="text-2xl font-bold text-foreground">{stat.value}</dt>
                    <dd className="text-xs uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto max-w-md">
                {/* Main mock course player */}
                <div className="rounded-3xl bg-base-100 ring-1 ring-base-300 shadow-2xl shadow-primary/10 overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="relative h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg" />
                    <span className="absolute bottom-3 left-3 badge badge-neutral/70 backdrop-blur gap-1 border-0 text-white">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Module 3 of 8
                    </span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="h-3 w-36 rounded-full bg-base-content/80" />
                        <div className="mt-2 h-2.5 w-52 rounded-full bg-base-300" />
                      </div>
                      <Star className="h-5 w-5 fill-warning text-warning shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Progress</span>
                        <span className="font-semibold text-primary">62%</span>
                      </div>
                      <progress className="progress progress-primary w-full" value={62} max={100} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { icon: BookOpen, label: "Lessons" },
                        { icon: GraduationCap, label: "Quizzes" },
                        { icon: TrendingUp, label: "Streaks" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col items-center gap-1 rounded-xl bg-base-200 py-2.5"
                        >
                          <item.icon className="h-4 w-4 text-primary" />
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating chips */}
                <div className="absolute -top-6 -left-10 rounded-2xl bg-base-100 ring-1 ring-base-300 shadow-xl px-4 py-3 flex items-center gap-3 -rotate-3 animate-bounce [animation-duration:3s]">
                  <div className="grid place-items-center h-9 w-9 rounded-full bg-success/15 text-success">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">+128%</p>
                    <p className="text-[11px] text-muted-foreground">Skill growth</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-8 rounded-2xl bg-base-100 ring-1 ring-base-300 shadow-xl px-4 py-3 flex items-center gap-3 rotate-2 animate-bounce [animation-delay:1.5s] [animation-duration:3.5s]">
                  <div className="grid place-items-center h-9 w-9 rounded-full bg-primary/15 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{courses.length}+ courses</p>
                    <p className="text-[11px] text-muted-foreground">Ready to explore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <div className="container mx-auto py-14 px-4 sm:px-6 md:px-8 scroll-mt-20" id="courses">
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
