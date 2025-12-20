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

        <div className="card bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="text-center mb-6">
              <h2 className="card-title text-3xl mb-2">
                {generationError ? (
                  <span className="text-error">Generation Failed</span>
                ) : (
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Generating Your Course
                  </span>
                )}
              </h2>
              {!generationError && (
                <p className="text-base-content/70">
                  AI is creating your complete course with slides and questions
                </p>
              )}
            </div>

            {generationError ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 bg-error/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="alert alert-error shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{generationError}</span>
                </div>
                <button
                  className="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform"
                  onClick={() => setStep('outline-edit')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to Edit Outline
                </button>
              </div>
            ) : generationProgress ? (
              <div className="space-y-6">
                {/* Current Stage Display */}
                <div className="flex items-center justify-center gap-4 p-4 bg-base-100 rounded-lg border border-base-300">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {generationProgress.stage === 'creating-course' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )}
                    {generationProgress.stage === 'generating-slides' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {generationProgress.stage === 'generating-questions' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-semibold">{generationProgress.message}</div>
                    <div className="text-sm text-base-content/70">
                      {generationProgress.stage === 'creating-course' && 'Setting up your course structure'}
                      {generationProgress.stage === 'generating-slides' && 'Creating engaging slide content'}
                      {generationProgress.stage === 'generating-questions' && 'Building assessment questions'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>{generationProgress.progress}%</span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${generationProgress.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Detailed Progress Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(generationProgress.stage === 'generating-slides' || generationProgress.stage === 'generating-questions') && generationProgress.currentModule && (
                    <div className="stat bg-base-100 rounded-lg shadow">
                      <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="stat-title">Current Module</div>
                      <div className="stat-value text-secondary text-2xl">{generationProgress.currentModule}</div>
                      <div className="stat-desc">of {generationProgress.totalModules} modules</div>
                    </div>
                  )}

                  <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="stat-title">Estimated Time</div>
                    <div className="stat-value text-primary text-lg">
                      {generationProgress.progress < 30 ? '2-3 min' :
                       generationProgress.progress < 70 ? '1-2 min' : '30 sec'}
                    </div>
                    <div className="stat-desc">remaining</div>
                  </div>
                </div>

                {/* Generation Stages Timeline */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-center">Generation Stages</h3>
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        ['creating-course', 'generating-slides', 'generating-questions'].includes(generationProgress.stage)
                          ? 'bg-primary text-primary-content' : 'bg-base-300'
                      }`}>
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div className={`w-8 h-0.5 ${
                        ['generating-slides', 'generating-questions'].includes(generationProgress.stage)
                          ? 'bg-primary' : 'bg-base-300'
                      }`}></div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        ['generating-slides', 'generating-questions'].includes(generationProgress.stage)
                          ? 'bg-secondary text-secondary-content' : 'bg-base-300'
                      }`}>
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div className={`w-8 h-0.5 ${
                        generationProgress.stage === 'generating-questions'
                          ? 'bg-secondary' : 'bg-base-300'
                      }`}></div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        generationProgress.stage === 'generating-questions'
                          ? 'bg-accent text-accent-content' : 'bg-base-300'
                      }`}>
                        <span className="text-xs font-bold">3</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center text-xs text-base-content/60">
                    <div className="text-center">
                      <div>Course Setup</div>
                    </div>
                    <div className="mx-8 text-center">
                      <div>Slide Generation</div>
                    </div>
                    <div className="text-center">
                      <div>Question Creation</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 bg-primary/10 rounded-full animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold">Initializing Course Generation</div>
                  <div className="text-base-content/70">Preparing AI models and setting up your course...</div>
                </div>
              </div>
            )}

            {!generationError && (
              <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-info mb-1">AI-Powered Generation</div>
                    <p className="text-sm text-base-content/70">
                      This process uses advanced AI to create high-quality educational content.
                      Generation time may vary based on course complexity.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}