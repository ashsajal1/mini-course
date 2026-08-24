import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, Pencil, Plus } from "lucide-react";

type CreatedCoursesProps = {
  courses: Array<{
    id: string;
    name: string;
    thumbnail_url: string;
    difficulty: string;
    created_at: Date;
    _count: {
      modules: number;
    };
  }>;
};

const difficultyBadge: Record<string, string> = {
  Beginner: "badge-success",
  Intermediate: "badge-warning",
  Advanced: "badge-info",
};

export function CreatedCoursesSection({ courses }: CreatedCoursesProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight">My Created Courses</h2>
        {courses.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
          </span>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl bg-card ring-1 ring-border p-10 text-center">
          <div className="grid place-items-center h-12 w-12 mx-auto mb-3 rounded-xl bg-primary/10 text-primary">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any courses yet.
          </p>
          <Link
            href="/course/create"
            className="btn btn-primary btn-sm gap-1.5 mx-auto"
          >
            Create your first course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course.id}
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

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="font-semibold leading-snug truncate group-hover:text-primary transition-colors">
                  {course.name}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className={`badge ${difficultyBadge[course.difficulty] ?? "badge-outline"} border-0`}>
                    {course.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {course._count.modules}{" "}
                    {course._count.modules === 1 ? "module" : "modules"}
                  </span>
                  <span>
                    Created {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/course/${course.id}`}
                  className="btn btn-outline btn-sm gap-1.5 flex-1 sm:flex-none"
                >
                  View
                </Link>
                <Link
                  href={`/course/edit/${course.id}`}
                  className="btn btn-primary btn-sm gap-1.5 flex-1 sm:flex-none"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
