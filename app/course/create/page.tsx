import CourseForm from "./course-form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateCoursePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/course/create");
  }
  return <CourseForm />;
}
