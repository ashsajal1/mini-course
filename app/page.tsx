export const dynamic = "force-dynamic";
import CourseCard from "./component/course-card";
import prisma from "@/prisma/client";

export default async function Home() {
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

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-base-content/80">
              No courses found
            </h2>
            <p className="mt-2 text-base-content/60">
              Check back later for new courses!
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.name}
                description={course.description}
                difficulty={course.difficulty}
                thumbnail_url={course.thumbnail_url}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
