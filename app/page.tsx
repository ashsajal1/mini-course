import CourseCard from "./component/course";
import prisma from "./lib/client";

export default async function Home() {
  const courses = await prisma?.course.findMany();

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl py-12 px-4 sm:px-6 md:px-8">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Courses
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Browse available courses
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {courses?.map((course) => (
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
      </main>
    </div>
  );
}
