"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCourses } from "./actions";
import { ArrowRight, Plus, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Course {
  id: string;
  name: string;
  description: string;
  difficulty?: string;
  thumbnail_url?: string;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await getCourses();
      setCourses(response);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-lg">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
        <div className="alert alert-error max-w-md">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={fetchCourses}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Your Courses</h1>
          <p className="text-lg text-base-content/70">
            Select a course to manage its content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              {course.thumbnail_url && (
                <figure className="h-48 bg-base-300">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-xl">{course.name}</h2>
                    {course.difficulty && (
                      <div className="badge badge-primary badge-outline mt-1">
                        {course.difficulty}
                      </div>
                    )}
                  </div>
                  <div className="badge badge-ghost">ID: {course.id}</div>
                </div>
                <p className="mt-2 text-base-content/80 line-clamp-2">
                  {course.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href={`/course/edit/${course.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Manage Course
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Course Card */}
          <div className="card bg-base-200 shadow-xl border-2 border-dashed border-base-content/20 hover:border-primary/50 transition-colors">
            <div className="card-body items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-base-content/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Create New Course</h3>
                <p className="text-sm text-base-content/60 mb-4">
                  Start building your new course from scratch
                </p>
                <Link
                  href="/course/create"
                  className="btn btn-outline btn-primary btn-sm"
                >
                  Create Course
                </Link>
              </div>
            </div>
          </div>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-base-content/30" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No courses yet</h2>
              <p className="text-base-content/70 mb-6">
                You haven&apos;t created any courses yet. Get started by
                creating your first course.
              </p>
              <Link href="/course/create" className="btn btn-primary gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Course
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
