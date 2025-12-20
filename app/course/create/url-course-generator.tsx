"use client";

import { useState } from "react";
import { generateCourseOutline, CourseOutline, estimateCourseComplexity } from "@/lib/course-ai-service";
import { ArrowRight, Loader2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

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
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="card-title text-3xl mb-2 justify-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Generate Course from Document
              </span>
            </h2>
            <p className="text-base-content/70">
              Transform any online content into a structured, interactive course
            </p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-lg">Document URL</span>
              <span className="label-text-alt text-base-content/60">
                {url && isValidUrl(url) && (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle className="h-4 w-4" />
                    Valid URL
                  </span>
                )}
              </span>
            </label>
            <div className="relative">
              <div className="join w-full">
                <div className="join-item flex items-center px-4 bg-base-200 border border-base-300 rounded-l-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/article-or-document"
                  className={`input join-item flex-1 input-lg border-x-0 ${
                    error ? "input-error focus:input-error" :
                    url && isValidUrl(url) ? "input-success focus:input-success" : ""
                  } transition-all duration-200`}
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  disabled={isGenerating}
                />
                <button
                  className={`btn join-item btn-lg ${
                    isGenerating ? "btn-disabled" :
                    url && isValidUrl(url) ? "btn-primary hover:scale-105" : "btn-ghost"
                  } transition-all duration-200`}
                  onClick={handleGenerateOutline}
                  disabled={isGenerating || !url.trim() || !isValidUrl(url)}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Generate Outline</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {/* URL Validation Indicators */}
              {url && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {isValidUrl(url) ? (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span>Valid URL format</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-warning">
                      <AlertCircle className="h-4 w-4" />
                      <span>Invalid URL format</span>
                    </div>
                  )}
                  {url && url.length > 0 && (
                    <div className="text-base-content/50">
                      {url.length} characters
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-error mt-4 shadow-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Enhanced Supported Sites Info */}
          <div className="mt-6 p-4 bg-base-200/50 rounded-lg border border-base-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <h3 className="font-medium">Supported Content Types</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {supportedSites.map((site) => (
                <div key={site.domain} className="badge badge-outline gap-1 hover:badge-primary transition-colors cursor-default touch-manipulation">
                  <ExternalLink className="h-3 w-3" />
                  <span className="hidden sm:inline">{site.name}</span>
                  <span className="sm:hidden">{site.name.split(' ')[0]}</span>
                </div>
              ))}
              <div className="badge badge-ghost hover:badge-neutral transition-colors cursor-default touch-manipulation">
                Any Website
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-base-content/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="leading-relaxed">Accepts any website URL containing educational content, articles, documentation, or web pages with valuable information. AI will analyze and structure the content automatically.</p>
            </div>
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