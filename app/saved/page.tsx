import type { Metadata } from "next";
import SavedCoursesView from "./saved-courses-view";

export const metadata: Metadata = {
  title: "Saved Courses",
  description: "Your personal collection of saved courses.",
};

export default function SavedCoursesPage() {
  return <SavedCoursesView />;
}
