"use client";

import { useSavedCourses } from "@/app/store/use-saved-courses";
import { getCourses } from "@/app/course/edit/actions";
import { useEffect, useState } from "react";
import CourseCard from "@/app/components/course/course-card";
import { Loader2, Bookmark, Search } from "lucide-react";

interface Course {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  thumbnail_url: string;
  _count: {
    modules: number;
  };
}

export function SavedCoursesSection() {
  const { savedCourseIds } = useSavedCourses();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const allCourses = await getCourses();
        const savedCourses = allCourses.filter((course) =>
          savedCourseIds.includes(course.id)
        );
        setCourses(savedCourses as unknown as Course[]);
      } catch (error) {
        console.error("Failed to fetch saved courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchCourses();
    }
  }, [savedCourseIds, mounted]);

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  });

  if (!mounted) return null;

  if (savedCourseIds.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Bookmark className="w-5 h-5" />
            </div>
            <h2 className="card-title text-2xl">Saved Courses</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-base-content/50" />
            </div>
            <input
              type="text"
              placeholder="Filter saved courses..."
              className="input input-bordered input-sm w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.name}
                description={course.description}
                difficulty={course.difficulty || "Beginner"}
                thumbnail_url={course.thumbnail_url || ""}
                moduleCount={course._count?.modules || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-200/50 rounded-xl">
            <p className="text-base-content/70">
              No saved courses match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
