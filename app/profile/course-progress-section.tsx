import Link from "next/link";
import Image from "next/image";

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
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Learning</h2>
      {courses.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <p className="text-lg text-base-content/70">
              You haven&apos;t started any courses yet.
            </p>
            <div className="mt-4">
              <Link href="/" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map(({ course, completedModules, totalModules }) => {
            const percentage =
              totalModules > 0
                ? Math.round((completedModules / totalModules) * 100)
                : 0;

            return (
              <Link
                key={course.id}
                href={`/course/${course.id}`}
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
                    <div className="mt-2 flex items-center gap-4">
                      <progress
                        className="progress progress-primary w-full"
                        value={percentage}
                        max="100"
                      ></progress>
                      <span className="font-bold text-primary">
                        {percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-base-content/60 mt-1">
                      {completedModules} / {totalModules} modules
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
