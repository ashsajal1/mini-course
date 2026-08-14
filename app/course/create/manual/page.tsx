"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CourseForm from "../course-form";
import CourseOutlineEditor from "../course-outline-editor";
import { CourseOutline } from "@/lib/course-ai-service";
import { CourseFormData } from "../course-validation";
import {
  createCourseFromOutline,
  CourseGenerationProgress,
} from "@/lib/course-creation-service";
import {
  ArrowLeft,
  FileText,
  Pencil,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

type Step = "course-form" | "outline-edit" | "course-generation";

const STEPS: { key: Step; label: string; icon: typeof FileText }[] = [
  { key: "course-form", label: "Course Details", icon: FileText },
  { key: "outline-edit", label: "Edit Outline", icon: Pencil },
  { key: "course-generation", label: "Generate", icon: Sparkles },
];

export default function ManualCourseCreationPage() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <ManualCourseCreationFlow />
        </Suspense>
      </div>
    </div>
  );
}

function ManualCourseCreationFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("course-form");
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [generationProgress, setGenerationProgress] =
    useState<CourseGenerationProgress | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleCourseFormSubmit = (data: CourseFormData) => {
    const hours = Math.floor(data.estimatedDuration / 60);
    const minutes = data.estimatedDuration % 60;
    const durationStr =
      hours > 0
        ? minutes > 0
          ? `${hours}h ${minutes}m`
          : `${hours}h`
        : `${minutes}m`;

    const initialOutline: CourseOutline = {
      title: data.name,
      description: data.description,
      difficulty: data.difficulty as "Beginner" | "Intermediate" | "Advanced",
      estimatedDuration: durationStr,
      language: data.lang,
      modules: [],
    };
    setOutline(initialOutline);
    setStep("outline-edit");
  };

  const handleOutlineChanged = (newOutline: CourseOutline) => {
    setOutline(newOutline);
  };

  const handleProceedToGeneration = async () => {
    if (!outline) return;

    setStep("course-generation");
    setGenerationError(null);

    try {
      setGenerationProgress({
        stage: "creating-course",
        progress: 50,
        message: "Creating your course with modules, slides, and questions...",
      });

      const result = await createCourseFromOutline(outline);

      if (result.success && result.course) {
        router.push(`/course/edit/${result.course.id}`);
      } else {
        setGenerationError(result.error || "Failed to generate course");
        setStep("outline-edit");
      }
    } catch {
      setGenerationError(
        "An unexpected error occurred during course generation"
      );
      setStep("outline-edit");
    } finally {
      setGenerationProgress(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Create Course Manually
        </h1>
        <p className="text-base-content/60 max-w-lg mx-auto">
          Define your course details, build the outline, then generate the full
          course.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === stepIndex;
          const isCompleted = i < stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-content shadow-md shadow-primary/25"
                    : isCompleted
                      ? "bg-primary/15 text-primary"
                      : "bg-base-200 text-base-content/40"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-6 sm:w-10 h-0.5 rounded-full transition-colors duration-300 ${
                    i < stepIndex ? "bg-primary" : "bg-base-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      {step === "outline-edit" && (
        <button
          className="btn btn-ghost btn-sm gap-1 mb-4"
          onClick={() => setStep("course-form")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course Details
        </button>
      )}
      {step === "course-generation" && (
        <button
          className="btn btn-ghost btn-sm gap-1 -mb-4"
          onClick={() => setStep("outline-edit")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Outline Editor
        </button>
      )}

      {/* Step Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step === "course-form" && (
          <CourseForm onSubmit={handleCourseFormSubmit} />
        )}

        {step === "outline-edit" && outline && (
          <CourseOutlineEditor
            initialOutline={outline}
            onOutlineChanged={handleOutlineChanged}
            onProceed={handleProceedToGeneration}
          />
        )}

        {step === "course-generation" && (
          <GenerationView
            progress={generationProgress}
            error={generationError}
            onRetry={() => setStep("outline-edit")}
          />
        )}
      </div>
    </div>
  );
}

function GenerationView({
  progress,
  error,
  onRetry,
}: {
  progress: CourseGenerationProgress | null;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-lg">
      <div className="card-body items-center text-center py-12 space-y-8">
        {error ? (
          <>
            <div className="p-4 bg-error/10 rounded-2xl">
              <AlertTriangle className="h-10 w-10 text-error" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-error">
                Generation Failed
              </h2>
              <p className="text-base-content/60 max-w-md">{error}</p>
            </div>
            <button className="btn btn-primary gap-2" onClick={onRetry}>
              <RotateCcw className="h-4 w-4" />
              Back to Edit Outline
            </button>
          </>
        ) : progress ? (
          <>
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Creating Your Course</h2>
              <p className="text-base-content/60">{progress.message}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>

            {/* Stage Info */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {(
                [
                  {
                    key: "creating-course",
                    label: "Course Setup",
                    active: progress.stage === "creating-course",
                  },
                  {
                    key: "generating-slides",
                    label: "Slides",
                    active: progress.stage === "generating-slides",
                  },
                  {
                    key: "generating-questions",
                    label: "Questions",
                    active: progress.stage === "generating-questions",
                  },
                ] as const
              ).map((stage) => (
                <div
                  key={stage.key}
                  className={`p-3 rounded-xl border transition-all ${
                    stage.active
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-base-200 bg-base-50"
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      stage.active ? "text-primary" : "text-base-content/40"
                    }`}
                  >
                    {stage.label}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-base-content/40">
              This may take a minute depending on course complexity.
            </p>
          </>
        ) : (
          <>
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                Initializing Course Creation
              </h2>
              <p className="text-base-content/60">
                Preparing to build your course...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
