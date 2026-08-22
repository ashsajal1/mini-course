"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourse } from "./actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/category-service";
import { courseFormSchema, type CourseFormData } from "./course-validation";
import {
  Loader2,
  ArrowRight,
  AlertCircle,
  Image,
  Tag,
  BarChart3,
  Globe,
  FileText,
  BookOpen,
  Clock,
} from "lucide-react";

interface CourseFormProps {
  onSubmit?: (data: CourseFormData) => void;
  defaultValues?: Partial<CourseFormData>;
}

export default function CourseForm({
  onSubmit,
  defaultValues,
}: CourseFormProps = { onSubmit: undefined }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);

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
    watch,
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "Beginner",
      lang: "en",
      estimatedDuration: 0,
      thumbnail_url: "",
      category_id: "",
      ...defaultValues,
    },
  });

  const descriptionValue = watch("description");
  const nameValue = watch("name");

  const onFormSubmit: SubmitHandler<CourseFormData> = async (data) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
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
    <div className="card bg-card border border shadow-lg">
      <div className="card-body p-6 sm:p-8">
        {/* Server Error */}
        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-sm mb-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Course Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-primary" />
              Course Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 ${
                errors.name
                  ? "border-error focus-within:border-error focus-within:shadow-error/10 focus-within:shadow-lg"
                  : "border focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg"
              }`}
              placeholder="e.g., Introduction to Next.js"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              {errors.name ? (
                <p className="text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-foreground/30">
                {nameValue?.length || 0}/100
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              Description
            </label>
            <textarea
              {...register("description")}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 resize-none ${
                errors.description
                  ? "border-error focus-within:border-error focus-within:shadow-error/10 focus-within:shadow-lg"
                  : "border focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg"
              }`}
              rows={4}
              placeholder="Describe what students will learn in this course..."
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <p className="text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-foreground/30">
                {descriptionValue?.length || 0}/1000
              </span>
            </div>
          </div>

          {/* Selects Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-primary" />
                Category
              </label>
              <select
                {...register("category_id")}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 appearance-none cursor-pointer ${
                  errors.category_id
                    ? "border-error focus:border-error"
                    : "border focus:border-primary focus:shadow-md focus:shadow-primary/5"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Optional</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4 text-primary" />
                Difficulty
              </label>
              <select
                {...register("difficulty")}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 appearance-none cursor-pointer ${
                  errors.difficulty
                    ? "border-error focus:border-error"
                    : "border focus:border-primary focus:shadow-md focus:shadow-primary/5"
                }`}
                disabled={isSubmitting}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-primary" />
                Language
              </label>
              <select
                {...register("lang")}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 appearance-none cursor-pointer ${
                  errors.lang
                    ? "border-error focus:border-error"
                    : "border focus:border-primary focus:shadow-md focus:shadow-primary/5"
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
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                Duration (min)
              </label>
              <input
                type="number"
                {...register("estimatedDuration", { valueAsNumber: true })}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 ${
                  errors.estimatedDuration
                    ? "border-error focus:border-error"
                    : "border focus:border-primary focus:shadow-md focus:shadow-primary/5"
                }`}
                placeholder="e.g., 120"
                min={1}
                max={1440}
                disabled={isSubmitting}
              />
              {errors.estimatedDuration && (
                <p className="text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.estimatedDuration.message}
                </p>
              )}
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Image className="h-4 w-4 text-primary" />
              Thumbnail URL
              <span className="text-xs font-normal text-foreground/40">
                (optional)
              </span>
            </label>
            <input
              type="url"
              {...register("thumbnail_url")}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-card outline-none transition-all duration-200 ${
                errors.thumbnail_url
                  ? "border-error focus-within:border-error focus-within:shadow-error/10 focus-within:shadow-lg"
                  : "border focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg"
              }`}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
            {errors.thumbnail_url && (
              <p className="text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.thumbnail_url.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
