"use client";

import { useSavedCourses } from "@/app/store/use-saved-courses";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface SaveCourseButtonProps {
  courseId: string;
  className?: string;
  fullWidth?: boolean;
  label?: string;
}

export default function SaveCourseButton({
  courseId,
  className = "",
  fullWidth = false,
  label,
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
      className={`btn btn-ghost btn-sm ${fullWidth ? "w-full justify-center gap-2" : "btn-square"} ${className} ${
        saved ? "text-primary" : "text-foreground/50 hover:text-primary"
      }`}
      title={saved ? "Unsave course" : "Save course"}
    >
      {saved ? (
        <BookmarkCheck className="w-5 h-5 fill-current shrink-0" />
      ) : (
        <Bookmark className="w-5 h-5 shrink-0" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
}
