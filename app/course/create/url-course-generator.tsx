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
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            Generate Course from Document
          </h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Document URL</span>
            </label>
            <div className="join">
              <input
                type="url"
                placeholder="https://example.com/article-or-document"
                className={`input input-bordered join-item flex-1 ${
                  error ? "input-error" : ""
                }`}
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={isGenerating}
              />
              <button
                className={`btn join-item ${
                  isGenerating ? "btn-disabled" : "btn-primary"
                }`}
                onClick={handleGenerateOutline}
                disabled={isGenerating || !url.trim() || !isValidUrl(url)}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Outline
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-error mt-3">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

           {/* Supported Sites Info */}
           <div className="mt-4">
             <h3 className="font-medium mb-2">Supported Content Types:</h3>
             <div className="flex flex-wrap gap-2">
               {supportedSites.map((site) => (
                 <div key={site.domain} className="badge badge-outline gap-1">
                   <ExternalLink className="h-3 w-3" />
                   {site.name}
                 </div>
               ))}
               <div className="badge badge-ghost">Any Website</div>
             </div>
             <p className="text-sm text-base-content/70 mt-2">
               Accepts any website URL containing educational content, articles, documentation, or web pages with valuable information.
             </p>
           </div>
        </div>
      </div>

      {/* Generated Outline Preview */}
      {generatedOutline && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="card-title text-xl">Course Outline Generated!</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold">{generatedOutline.title}</h4>
                <p className="text-sm text-base-content/80 mt-1">
                  {generatedOutline.description}
                </p>
              </div>

              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Difficulty</div>
                  <div className="stat-value text-primary">{generatedOutline.difficulty}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Modules</div>
                  <div className="stat-value text-secondary">{generatedOutline.modules.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Duration</div>
                  <div className="stat-value text-accent">{generatedOutline.estimatedDuration}</div>
                </div>
              </div>
            </div>

            <div className="divider">Course Modules</div>

            <div className="space-y-3">
              {generatedOutline.modules.map((module, index) => (
                <div key={index} className="card card-compact bg-base-200">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="card-title text-base">
                          {module.order}. {module.title}
                        </h4>
                        <p className="text-sm text-base-content/70 mt-1">
                          {module.description}
                        </p>
                        {module.learningObjectives.length > 0 && (
                          <ul className="text-xs mt-2 space-y-1">
                            {module.learningObjectives.slice(0, 2).map((objective, objIndex) => (
                              <li key={objIndex} className="flex items-start gap-1">
                                <span className="text-primary mt-0.5">•</span>
                                {objective}
                              </li>
                            ))}
                            {module.learningObjectives.length > 2 && (
                              <li className="text-base-content/60">
                                +{module.learningObjectives.length - 2} more objectives
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                      <div className="badge badge-primary ml-2">
                        {module.estimatedDuration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {estimates && (
              <div className="alert alert-info mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <strong>Estimated Generation:</strong> {estimates.estimatedGenerationTime} •
                    {estimates.totalSlides} slides • {estimates.totalQuestions} questions
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}