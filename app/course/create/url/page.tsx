"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import UrlCourseGenerator from "../url-course-generator";
import CourseOutlineEditor from "../course-outline-editor";
import { CourseOutline } from "@/lib/course-ai-service";
import {
  createCourseFromOutline,
  CourseGenerationProgress,
} from "@/lib/course-creation-service";
import {
  ArrowLeft,
  Link as LinkIcon,
  Pencil,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

type Step = "url-input" | "outline-edit" | "course-generation";

const STEPS: { key: Step; label: string; icon: typeof LinkIcon }[] = [
  { key: "url-input", label: "Paste URL", icon: LinkIcon },
  { key: "outline-edit", label: "Edit Outline", icon: Pencil },
  { key: "course-generation", label: "Generate", icon: Sparkles },
];

export default function UrlCourseCreationPage() {
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
          <UrlCourseCreationFlow />
        </Suspense>
      </div>
    </div>
  );
}

function UrlCourseCreationFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("url-input");
  const [generatedOutline, setGeneratedOutline] =
    useState<CourseOutline | null>(null);
  const [finalOutline, setFinalOutline] = useState<CourseOutline | null>(null);
  const [generationProgress, setGenerationProgress] =
    useState<CourseGenerationProgress | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleOutlineGenerated = (outline: CourseOutline) => {
    setGeneratedOutline(outline);
    setStep("outline-edit");
  };

  const handleOutlineChanged = (outline: CourseOutline) => {
    setFinalOutline(outline);
  };

  const handleProceedToGeneration = async () => {
    if (!finalOutline) return;

    setStep("course-generation");
    setGenerationError(null);

    try {
      setGenerationProgress({
        stage: "creating-course",
        progress: 50,
        message: "Generating your complete course with slides and questions...",
      });

      const result = await createCourseFromOutline(finalOutline);

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

  const handleBackToUrlInput = () => {
    setStep("url-input");
    setGeneratedOutline(null);
    setFinalOutline(null);
  };

  const handleBackToOutlineEdit = () => {
    setStep("outline-edit");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Create Course from URL
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Paste a document URL, review the AI-generated outline, then generate
          your full course.
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
                      : "bg-muted text-foreground/40"
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
                    i < stepIndex ? "bg-primary" : "bg-muted"
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
          className="btn btn-ghost btn-sm gap-1 -mb-4"
          onClick={handleBackToUrlInput}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to URL Input
        </button>
      )}
      {step === "course-generation" && (
        <button
          className="btn btn-ghost btn-sm gap-1 -mb-4"
          onClick={handleBackToOutlineEdit}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Outline Editor
        </button>
      )}

      {/* Step Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step === "url-input" && (
          <UrlCourseGenerator onOutlineGenerated={handleOutlineGenerated} />
        )}

        {step === "outline-edit" && generatedOutline && (
          <CourseOutlineEditor
            initialOutline={generatedOutline}
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
    <div className="card bg-card border border shadow-lg">
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
              <p className="text-muted-foreground max-w-md">{error}</p>
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
              <h2 className="text-2xl font-bold">Generating Your Course</h2>
              <p className="text-muted-foreground">{progress.message}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
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
                      : "border bg-base-50"
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      stage.active ? "text-primary" : "text-foreground/40"
                    }`}
                  >
                    {stage.label}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-foreground/40">
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
                Initializing Course Generation
              </h2>
              <p className="text-muted-foreground">
                Preparing AI models and setting up your course...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
