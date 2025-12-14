import CourseForm from "./course-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Course",
};

export default async function CreateCoursePage() {
  return <CourseForm />;
}
