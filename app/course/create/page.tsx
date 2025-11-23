import { currentUser } from "@clerk/nextjs/server";
import CourseForm from "./course-form";

export default async function CreateCoursePage() {
  const user = await currentUser();
  const userName = user?.fullName || "";

  return <CourseForm userName={userName} />;
}
