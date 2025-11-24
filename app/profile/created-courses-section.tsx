import Link from "next/link";
import Image from "next/image";

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

export function CreatedCoursesSection({ courses }: CreatedCoursesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Created Courses</h2>
      {courses.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <p className="text-lg text-base-content/70">
              You haven&apos;t created any courses yet.
            </p>
            <div className="mt-4">
              <Link href="/course/create" className="btn btn-primary">
                Create Course
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body flex-row gap-6 items-center">
                <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="card-title text-lg">{course.name}</h3>
                  <p className="text-sm text-base-content/60 mt-1">
                    {course._count.modules} modules • {course.difficulty}
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Created {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/course/edit/${course.id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
