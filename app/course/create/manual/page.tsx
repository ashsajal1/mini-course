import CourseForm from "../course-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Course Manually",
};

export default async function ManualCourseCreationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <a href="/course/create" className="btn btn-ghost gap-2">
          ← Back to Course Creation Options
        </a>
      </div>

      <CourseForm />
    </div>
  );
}