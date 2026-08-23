export const dynamic = "force-dynamic";

import CourseList from "@/app/components/course/course-list";
import prisma from "@/prisma/client";
import { BookOpen, Compass, FolderOpen, Layers } from "lucide-react";

export default async function CoursePage() {
  const courses = await prisma.course.findMany({
    where: {
      OR: [{ isPublic: true }, { isPublic: null }],
    },
    include: {
      category: true,
      _count: {
        select: { modules: true },
      },
    },
  });

  const categoryCount = new Set(courses.map((c) => c.category_id).filter(Boolean)).size;
  const moduleCount = courses.reduce((sum, c) => sum + c._count.modules, 0);

  const stats = [
    { icon: BookOpen, value: String(courses.length), label: "Courses" },
    { icon: FolderOpen, value: String(categoryCount), label: "Categories" },
    { icon: Layers, value: String(moduleCount), label: "Modules" },
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Page hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Compass className="h-3.5 w-3.5" />
            Course Library
          </span>
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-4">
            Explore our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              courses
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground">
            Bite-sized lessons across topics and skill levels — find the one
            that fits your goals.
          </p>

          <dl className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span className="grid place-items-center h-9 w-9 rounded-full bg-primary/10 text-primary">
                  <stat.icon className="h-4.5 w-4.5" />
                </span>
                <div className="text-left">
                  <dt className="text-lg font-bold leading-none text-foreground">
                    {stat.value}
                  </dt>
                  <dd className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">
                    {stat.label}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Catalog */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-20">
        <CourseList courses={courses!} />
      </div>
    </div>
  );
}
