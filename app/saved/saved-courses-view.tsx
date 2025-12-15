"use client";

import { useSavedCourses } from "@/app/store/use-saved-courses";
import { getCourses } from "@/app/course/edit/actions";
import { useEffect, useState } from "react";
import CourseCard from "@/app/components/course/course-card";
import { Loader2, Bookmark } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  lang: string;
  thumbnail_url: string;
  _count: {
    modules: number;
  };
}

export default function SavedCoursesView() {
  const { savedCourseIds } = useSavedCourses();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would have an endpoint to fetch specific courses by IDs
        // For now, we fetch all and filter client-side as per plan
        const allCourses = await getCourses();
        // The getCourses action returns a slightly different shape, let's cast or map it
        // Actually getCourses returns Course[] which matches our interface mostly
        // but we need to filter by savedCourseIds
        const savedCourses = allCourses.filter((course) =>
          savedCourseIds.includes(course.id)
        );

        // Map to match CourseCard props if needed, but CourseCard expects:
        // id, title, description, difficulty, lang, thumbnail_url, moduleCount
        // getCourses returns: id, name, description, difficulty, lang, thumbnail_url, _count { modules }

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Saved Courses</h1>
            <p className="text-base-content/70">
              Your personal collection of courses
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.name}
                description={course.description}
                difficulty={course.difficulty || "Beginner"}
                lang={course.lang || "en"}
                thumbnail_url={course.thumbnail_url || ""}
                moduleCount={course._count?.modules || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-base-200/50 rounded-2xl border border-base-200">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-base-content/30" />
              </div>
              <h2 className="text-xl font-bold mb-2">No saved courses yet</h2>
              <p className="text-base-content/70 mb-6">
                Browse our catalog and save courses you want to watch later.
              </p>
              <Link href="/" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}