"use client";

import { useState } from "react";
import { generateCourseOutline, CourseOutline, estimateCourseComplexity } from "@/lib/course-ai-service";
import { ArrowRight, Loader2, AlertCircle, CheckCircle, Link as LinkIcon } from "lucide-react";

interface UrlCourseGeneratorProps {
  onOutlineGenerated: (outline: CourseOutline) => void;
}

export default function UrlCourseGenerator({ onOutlineGenerated }: UrlCourseGeneratorProps) {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState<CourseOutline | null>(null);
  const [estimates, setEstimates] = useState<{ totalSlides: number; totalQuestions: number; estimatedGenerationTime: string } | null>(null);

  const handleGenerateOutline = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedOutline(null);
    setEstimates(null);

    try {
      const result = await generateCourseOutline(url);

      if (result.success && result.outline) {
        setGeneratedOutline(result.outline);
        // Calculate estimates for the generated outline
        const outlineEstimates = await estimateCourseComplexity(result.outline);
        setEstimates(outlineEstimates);
        onOutlineGenerated(result.outline);
      } else {
        setError(result.error || "Failed to generate course outline");
      }
    } catch (err) {
      setError("An unexpected error occurred while generating the outline");
      console.error("Outline generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (error) setError(""); // Clear error when user starts typing
  };

  const isValidUrl = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const supportedSites = [
    { name: "Google Docs", domain: "docs.google.com" },
    { name: "GitHub", domain: "github.com" },
    { name: "Medium", domain: "medium.com" },
    { name: "Notion", domain: "notion.so" },
    { name: "MDN Web Docs", domain: "developer.mozilla.org" },
  ];

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <div className="card bg-base-100 border border-base-300 shadow-lg">
        <div className="card-body p-6 sm:p-8">
          {/* Input Field */}
          <div className="form-control">
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-base-100 ${
                error
                  ? "border-error focus-within:border-error focus-within:shadow-error/10 focus-within:shadow-lg"
                  : url && isValidUrl(url)
                    ? "border-success focus-within:border-success focus-within:shadow-success/10 focus-within:shadow-lg"
                    : "border-base-300 focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg"
              }`}
            >
              <LinkIcon
                className={`h-5 w-5 flex-shrink-0 ${
                  error
                    ? "text-error"
                    : url && isValidUrl(url)
                      ? "text-success"
                      : "text-base-content/30"
                } transition-colors`}
              />
              <input
                type="url"
                placeholder="Paste a URL to any document, article, or web page..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-base-content/30"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    url.trim() &&
                    isValidUrl(url) &&
                    !isGenerating
                  ) {
                    handleGenerateOutline();
                  }
                }}
              />
              {url && (
                <button
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => {
                    setUrl("");
                    setError("");
                  }}
                  disabled={isGenerating}
                >
                  ✕
                </button>
              )}
              <button
                className={`btn btn-sm rounded-lg gap-1 ${
                  isGenerating
                    ? "btn-disabled"
                    : url && isValidUrl(url)
                      ? "btn-primary"
                      : "btn-ghost"
                }`}
                onClick={handleGenerateOutline}
                disabled={isGenerating || !url.trim() || !isValidUrl(url)}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Validation hint */}
            {url && !isValidUrl(url) && (
              <p className="mt-2 text-xs text-warning flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Enter a valid URL starting with http:// or https://
              </p>
            )}

            {error && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-error/10 text-error text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Supported Sites */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-base-content/40">Works with</span>
            {supportedSites.map((site) => (
              <span
                key={site.domain}
                className="text-xs px-2 py-0.5 rounded-md bg-base-200 text-base-content/60"
              >
                {site.name}
              </span>
            ))}
            <span className="text-xs px-2 py-0.5 rounded-md bg-base-200 text-base-content/60">
              Any website
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Generated Outline Preview */}
      {generatedOutline && (
        <div className="card bg-gradient-to-br from-success/5 to-success/10 shadow-xl border border-success/20 animate-in slide-in-from-bottom-4 duration-500">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-success rounded-full">
                <CheckCircle className="h-6 w-6 text-success-content" />
              </div>
              <div>
                <h3 className="card-title text-2xl text-success">Course Outline Generated!</h3>
                <p className="text-base-content/70">Review and customize your course structure below</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="p-4 bg-base-100 rounded-lg border border-base-300">
                  <h4 className="font-bold text-lg mb-2">{generatedOutline.title}</h4>
                  <p className="text-sm text-base-content/80 leading-relaxed">
                    {generatedOutline.description}
                  </p>
                </div>
              </div>

              <div className="stats stats-vertical shadow-lg bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="stat-title">Difficulty</div>
                  <div className="stat-value text-primary text-2xl">{generatedOutline.difficulty}</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="stat-title">Modules</div>
                  <div className="stat-value text-secondary text-2xl">{generatedOutline.modules.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-title">Duration</div>
                  <div className="stat-value text-accent text-2xl">{generatedOutline.estimatedDuration}</div>
                </div>
              </div>
            </div>

            <div className="divider divider-primary">
              <span className="bg-base-100 px-3 py-1 rounded-full text-primary font-semibold">
                Course Modules ({generatedOutline.modules.length})
              </span>
            </div>

            <div className="space-y-4">
              {generatedOutline.modules.map((module, index) => (
                <div key={index} className="card card-compact bg-gradient-to-r from-base-100 to-base-200 border border-base-300 hover:shadow-md transition-all duration-200">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold text-sm">
                            {module.order}
                          </div>
                          <h4 className="card-title text-base font-semibold">
                            {module.title}
                          </h4>
                        </div>
                        <p className="text-sm text-base-content/80 mt-2 leading-relaxed">
                          {module.description}
                        </p>
                        {module.learningObjectives.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-base-content/60 mb-1">
                              Learning Objectives:
                            </div>
                            <ul className="text-xs space-y-1">
                              {module.learningObjectives.slice(0, 3).map((objective, objIndex) => (
                                <li key={objIndex} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-base-content/80">{objective}</span>
                                </li>
                              ))}
                              {module.learningObjectives.length > 3 && (
                                <li className="text-base-content/60 ml-3.5">
                                  +{module.learningObjectives.length - 3} more objectives
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="badge badge-primary badge-lg font-semibold">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.estimatedDuration}
                        </div>
                        <div className="text-xs text-base-content/50">
                          Module {module.order} of {generatedOutline.modules.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {estimates && (
              <div className="mt-6 p-4 bg-gradient-to-r from-info/10 to-blue-500/10 rounded-lg border border-info/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-info rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-info">Generation Estimates</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{estimates.estimatedGenerationTime}</div>
                    <div className="text-sm text-base-content/70">Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary mb-1">{estimates.totalSlides}</div>
                    <div className="text-sm text-base-content/70">Slides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">{estimates.totalQuestions}</div>
                    <div className="text-sm text-base-content/70">Questions</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-base-content/60 text-center">
                  These estimates are based on the generated outline and may vary during actual generation
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}