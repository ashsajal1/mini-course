import Image from "next/image";
import data from "./mockdata.json";

type Course = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  thumbnail_url: string;
};

type Root = {
  course: Course;
};

export default function Home() {
  const root = data as Root;
  const baseCourse = root.course;
  // Duplicate the single mocked course so the grid shows multiple cards
  const courses: Course[] = Array.from({ length: 8 }, (_, i) => ({
    ...baseCourse,
    id: `${baseCourse.id}_${i}`,
  }));

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
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 w-full bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={course.thumbnail_url || "/next.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {course.title}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {course.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
