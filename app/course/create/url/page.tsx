"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import UrlCourseGenerator from "../url-course-generator";
import CourseOutlineEditor from "../course-outline-editor";
import { CourseOutline } from "@/lib/course-ai-service";
import { createCourseFromOutline, CourseGenerationProgress } from "@/lib/course-creation-service";

export default function UrlCourseCreationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Course from Document</h1>
        <p className="text-base-content/70">
          Generate a complete course outline from any document URL. Our AI will analyze the content
          and create structured modules with slides and questions.
        </p>
      </div>

      <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
        <UrlCourseCreationFlow />
      </Suspense>
    </div>
  );
}

function UrlCourseCreationFlow() {
  const router = useRouter();
  const [step, setStep] = useState<'url-input' | 'outline-edit' | 'course-generation'>('url-input');
  const [generatedOutline, setGeneratedOutline] = useState<CourseOutline | null>(null);
  const [finalOutline, setFinalOutline] = useState<CourseOutline | null>(null);
  const [generationProgress, setGenerationProgress] = useState<CourseGenerationProgress | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleOutlineGenerated = (outline: CourseOutline) => {
    setGeneratedOutline(outline);
    setStep('outline-edit');
  };

  const handleOutlineChanged = (outline: CourseOutline) => {
    setFinalOutline(outline);
  };

  const handleProceedToGeneration = async () => {
    if (!finalOutline) return;

    setStep('course-generation');
    setGenerationError(null);

    try {
      // For now, just show a simple loading state
      setGenerationProgress({
        stage: 'creating-course',
        progress: 50,
        message: 'Generating your complete course with slides and questions...',
      });

      const result = await createCourseFromOutline(finalOutline);

      if (result.success && result.course) {
        // Redirect to the course edit page
        router.push(`/course/edit/${result.course.id}`);
      } else {
        setGenerationError(result.error || 'Failed to generate course');
        setStep('outline-edit'); // Go back to editing
      }
    } catch (error) {
      setGenerationError('An unexpected error occurred during course generation');
      setStep('outline-edit');
    } finally {
      setGenerationProgress(null);
    }
  };

  const handleBackToUrlInput = () => {
    setStep('url-input');
    setGeneratedOutline(null);
    setFinalOutline(null);
  };

  const handleBackToOutlineEdit = () => {
    setStep('outline-edit');
  };

  if (step === 'url-input') {
    return (
      <UrlCourseGenerator onOutlineGenerated={handleOutlineGenerated} />
    );
  }

  if (step === 'outline-edit' && generatedOutline) {
    return (
      <div>
        <div className="mb-6">
          <button
            className="btn btn-ghost gap-2"
            onClick={handleBackToUrlInput}
          >
            ← Back to URL Input
          </button>
        </div>

        <CourseOutlineEditor
          initialOutline={generatedOutline}
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
              {generationError ? 'Generation Failed' : 'Generating Your Course'}
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
                  Initializing course generation...
                </p>
              </div>
            )}

            {!generationError && (
              <p className="text-sm text-base-content/60 mt-4">
                This process involves AI content generation and may take several minutes.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}