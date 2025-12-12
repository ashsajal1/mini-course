"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { updateCourseStatus } from "./actions";
import { useRouter } from "next/navigation";

interface CourseStatusToggleProps {
  courseId: string;
  isPublic: boolean | null;
}

export default function CourseStatusToggle({
  courseId,
  isPublic: initialIsPublic,
}: CourseStatusToggleProps) {
  const [isPublic, setIsPublic] = useState(
    initialIsPublic === true || initialIsPublic === null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !isPublic;

    // Optimistic update
    setIsPublic(newState);

    const result = await updateCourseStatus(courseId, newState);

    if (!result.success) {
      // Revert on failure
      setIsPublic(!newState);
      // Ideally show toast here
      alert("Failed to update status");
    } else {
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="font-bold text-sm text-base-content/70 uppercase tracking-wide mb-3">
          Course Visibility
        </h3>

        <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isPublic
                  ? "bg-success/10 text-success"
                  : "bg-base-content/10 text-base-content/50"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPublic ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {isPublic ? "Public" : "Private"}
              </span>
              <span className="text-xs text-base-content/60">
                {isPublic ? "Visible to everyone" : "Only visible to you"}
              </span>
            </div>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={isPublic}
            onChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
