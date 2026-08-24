import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

type CourseProgressProps = {
  courses: Array<{
    course: {
      id: string;
      name: string;
      thumbnail_url: string;
    };
    completedModules: number;
    totalModules: number;
  }>;
};

export function CourseProgressSection({ courses }: CourseProgressProps) {
  const completedCount = courses.filter(
    ({ completedModules, totalModules }) =>
      totalModules > 0 && completedModules >= totalModules
  ).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight">My Learning</h2>
        {courses.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {courses.length}{" "}
            {courses.length === 1 ? "course" : "courses"}
            {completedCount > 0 &&
              ` · ${completedCount} ${completedCount === 1 ? "completed" : "completed"}`}
          </span>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl bg-card ring-1 ring-border p-10 text-center">
          <div className="grid place-items-center h-12 w-12 mx-auto mb-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t started any courses yet.
          </p>
          <Link href="/" className="btn btn-primary btn-sm gap-1.5 mx-auto">
            Find your first course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {courses.map(({ course, completedModules, totalModules }) => {
            const percentage =
              totalModules > 0
                ? Math.round((completedModules / totalModules) * 100)
                : 0;
            const isCompleted =
              totalModules > 0 && completedModules >= totalModules;

            return (
              <li key={course.id}>
                <Link
                  href={`/course/${course.id}`}
                  className="group rounded-2xl bg-card ring-1 ring-border p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
                >
                  <div className="relative w-full sm:w-32 h-40 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={course.thumbnail_url || "/placeholder-course.svg"}
                      alt={course.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="128px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold leading-snug truncate group-hover:text-primary transition-colors">
                        {course.name}
                      </h3>
                      <span
                        className={`text-sm font-bold shrink-0 ${
                          isCompleted ? "text-success" : "text-primary"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-success shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {completedModules}/{totalModules} modules
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary shrink-0 transition-all duration-300 group-hover:gap-2">
                    {isCompleted ? "Review" : "Continue"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
