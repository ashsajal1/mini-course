import CourseList from "./course-list";
import prisma from "@/prisma/client";

export default async function CoursePage() {
  const courses = await prisma.course.findMany();

  return (
    <div className="min-h-screen w-full bg-base-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            Courses
          </h1>
          <p className="mt-1 text-sm text-base-content/70">
            Browse available courses
          </p>
        </header>

        <CourseList courses={courses!} />
      </div>
    </div>
  );
}
