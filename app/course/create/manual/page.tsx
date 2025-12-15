"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CourseForm from "../course-form";
import CourseOutlineEditor from "../course-outline-editor";
import { CourseOutline } from "@/lib/course-ai-service";
import { CourseFormData } from "../course-validation";
import { createCourseFromOutline, CourseGenerationProgress } from "@/lib/course-creation-service";

export default function ManualCourseCreationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/course/create" className="btn btn-ghost gap-2">
          ← Back to Course Creation Options
        </Link>
      </div>

      <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
        <ManualCourseCreationFlow />
      </Suspense>
    </div>
  );
}

function ManualCourseCreationFlow() {
  const router = useRouter();
  const [step, setStep] = useState<'course-form' | 'outline-edit' | 'course-generation'>('course-form');
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [generationProgress, setGenerationProgress] = useState<CourseGenerationProgress | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleCourseFormSubmit = (data: CourseFormData) => {
    // Create initial outline based on course data
    const initialOutline: CourseOutline = {
      title: data.name,
      description: data.description,
      difficulty: data.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      estimatedDuration: "2 hours", // Default
      language: data.lang,
      modules: [],
    };
    setOutline(initialOutline);
    setStep('outline-edit');
  };

  const handleOutlineChanged = (newOutline: CourseOutline) => {
    setOutline(newOutline);
  };

  const handleProceedToGeneration = async () => {
    if (!outline) return;

    setStep('course-generation');
    setGenerationError(null);

    try {
      setGenerationProgress({
        stage: 'creating-course',
        progress: 50,
        message: 'Creating your course with modules, slides, and questions...',
      });

      const result = await createCourseFromOutline(outline);

      if (result.success && result.course) {
        // Redirect to the course edit page
        router.push(`/course/edit/${result.course.id}`);
      } else {
        setGenerationError(result.error || 'Failed to generate course');
        setStep('outline-edit');
      }
    } catch {
      setGenerationError('An unexpected error occurred during course generation');
      setStep('outline-edit');
    } finally {
      setGenerationProgress(null);
    }
  };

  const handleBackToCourseForm = () => {
    setStep('course-form');
  };

  const handleBackToOutlineEdit = () => {
    setStep('outline-edit');
  };

  if (step === 'course-form') {
    return <CourseForm onSubmit={handleCourseFormSubmit} />;
  }

  if (step === 'outline-edit' && outline) {
    return (
      <div>
        <div className="mb-6">
          <button
            className="btn btn-ghost gap-2"
            onClick={handleBackToCourseForm}
          >
            ← Back to Course Details
          </button>
        </div>

        <CourseOutlineEditor
          initialOutline={outline}
          onOutlineChanged={handleOutlineChanged}
          onProceed={handleProceedToGeneration}
        />
      </div>
    );
  }

  if (step === 'course-generation') {
    return (
      <div>
        <div className="mb-6">
          <button
            className="btn btn-ghost gap-2"
            onClick={handleBackToOutlineEdit}
          >
            ← Back to Outline Editor
          </button>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl mb-4">
              {generationError ? 'Generation Failed' : 'Creating Your Course'}
            </h2>

            {generationError ? (
              <div className="space-y-4">
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{generationError}</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep('outline-edit')}
                >
                  ← Back to Edit Outline
                </button>
              </div>
            ) : generationProgress ? (
              <div className="space-y-4">
                <div className="text-lg font-medium">
                  {generationProgress.message}
                </div>

                <div className="w-full bg-base-200 rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress.progress}%` }}
                  ></div>
                </div>

                <div className="text-sm text-base-content/60">
                  {generationProgress.progress}% complete
                </div>

                {generationProgress.stage === 'generating-slides' && generationProgress.currentModule && (
                  <div className="text-sm">
                    Processing module {generationProgress.currentModule} of {generationProgress.totalModules}
                  </div>
                )}

                {generationProgress.stage === 'generating-questions' && generationProgress.currentModule && (
                  <div className="text-sm">
                    Creating questions for module {generationProgress.currentModule} of {generationProgress.totalModules}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="text-base-content/70">
                  Initializing course creation...
                </p>
              </div>
            )}

            {!generationError && (
              <p className="text-sm text-base-content/60 mt-4">
                This process creates your course with all modules, slides, and questions.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}