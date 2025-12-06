"use client";

import { useSavedCourses } from "@/app/store/use-saved-courses";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface SaveCourseButtonProps {
  courseId: string;
  className?: string;
}

export default function SaveCourseButton({
  courseId,
  className = "",
}: SaveCourseButtonProps) {
  const { isSaved, saveCourse, unsaveCourse } = useSavedCourses();

  const saved = isSaved(courseId);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      unsaveCourse(courseId);
    } else {
      saveCourse(courseId);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`btn btn-ghost btn-sm btn-square ${className} ${
        saved ? "text-primary" : "text-base-content/50 hover:text-primary"
      }`}
      title={saved ? "Unsave course" : "Save course"}
    >
      {saved ? (
        <BookmarkCheck className="w-5 h-5 fill-current" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </button>
  );
}
