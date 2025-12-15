"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourse } from "./actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/category-service";
import { courseFormSchema, type CourseFormData } from "./course-validation"

interface CourseFormProps {
  onSubmit?: (data: CourseFormData) => void;
}

export default function CourseForm({ onSubmit }: CourseFormProps = { onSubmit: undefined }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      difficulty: "Beginner",
      lang: "en",
      thumbnail_url: "",
      category_id: "",
    },
  });

  const onFormSubmit: SubmitHandler<CourseFormData> = async (data) => {
    if (onSubmit) {
      // Custom onSubmit provided, use it instead of creating course
      onSubmit(data);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await createCourse(formData);

      if (result?.error) {
        setServerError(result.error);
      } else if (result?.course?.id) {
        reset();
        router.push(`/course/edit/${result.course.id}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setServerError("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="w-full max-w-4xl mx-auto card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-base-content/70 mb-6">
            Fill in the details below to create a new course
          </p>

          {serverError && (
            <div className="alert alert-error mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

           <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Name */}
              <div className="form-control md:col-span-2">
                <label className="label" htmlFor="name">
                  <span className="label-text font-semibold">Course Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`input input-bordered w-full ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="Introduction to Next.js"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.name.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text font-semibold">
                  Course Description
                </span>
              </label>
              <textarea
                id="description"
                {...register("description")}
                className={`textarea textarea-bordered w-full ${
                  errors.description ? "textarea-error" : ""
                }`}
                rows={4}
                placeholder="Describe what students will learn in this course..."
                disabled={isSubmitting}
              ></textarea>
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="form-control">
                <label className="label" htmlFor="category_id">
                  <span className="label-text font-semibold">
                    Category
                  </span>
                </label>
                <select
                  id="category_id"
                  {...register("category_id")}
                  className={`select select-bordered w-full ${
                    errors.category_id ? "select-error" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a category (optional)</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.category_id.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Difficulty */}
              <div className="form-control">
                <label className="label" htmlFor="difficulty">
                  <span className="label-text font-semibold">
                    Difficulty Level
                  </span>
                </label>
                <select
                  id="difficulty"
                  {...register("difficulty")}
                  className={`select select-bordered w-full ${
                    errors.difficulty ? "select-error" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.difficulty && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.difficulty.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Language */}
              <div className="form-control">
                <label className="label" htmlFor="lang">
                  <span className="label-text font-semibold">
                    Course Language
                  </span>
                </label>
                <select
                  id="lang"
                  {...register("lang")}
                  className={`select select-bordered w-full ${
                    errors.lang ? "select-error" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="ar">Arabic</option>
                </select>
                {errors.lang && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.lang.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Thumbnail URL */}
              <div className="form-control">
                <label className="label" htmlFor="thumbnail_url">
                  <span className="label-text font-semibold">
                    Thumbnail URL
                  </span>
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  {...register("thumbnail_url")}
                  className={`input input-bordered w-full ${
                    errors.thumbnail_url ? "input-error" : ""
                  }`}
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting}
                />
                <label className="label">
                  <span
                    className={`label-text-alt ${
                      errors.thumbnail_url ? "text-error" : "text-info"
                    }`}
                  >
                    {errors.thumbnail_url
                      ? errors.thumbnail_url.message
                      : "Enter a valid image URL (JPG, PNG)"}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
