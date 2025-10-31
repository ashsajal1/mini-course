import { Course } from "../generated/prisma/client";
import CourseCard from "../component/course-card";

export default function CourseList({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-base-content/50">No courses found</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
}
