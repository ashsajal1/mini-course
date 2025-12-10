"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, AlertCircle, FileText } from "lucide-react";
import { generateMCQFromSlide } from "@/app/course/edit/[id]/question/ai-actions";
import type { Option } from "./question-form";

interface QuestionAiAssistantProps {
  previousSlideContent?: string;
  onQuestionGenerated: (data: {
    title: string;
    question: string;
    options: Option[];
  }) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
  isSubmitting?: boolean;
}

export default function QuestionAiAssistant({
  previousSlideContent,
  onQuestionGenerated,
  onGeneratingChange,
  isSubmitting = false,
}: QuestionAiAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSlideContent = previousSlideContent && previousSlideContent.trim();

  const handleGenerate = async () => {
    if (!hasSlideContent) return;

    setIsGenerating(true);
    onGeneratingChange?.(true);
    setError(null);

    try {
      const result = await generateMCQFromSlide(previousSlideContent);

      if (result.success && result.mcq) {
        onQuestionGenerated({
          title: result.mcq.title,
          question: result.mcq.question,
          options: result.mcq.options,
        });
        setIsExpanded(false);
      } else {
        setError(result.error || "Failed to generate question");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
      onGeneratingChange?.(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn btn-ghost btn-sm w-full justify-between border border-base-300 hover:bg-base-200"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Assistant</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable Panel */}
      {isExpanded && (
        <div className="mt-2 space-y-4 rounded-lg border border-base-300 bg-base-200/50 p-4">
          {/* Previous Slide Content Preview */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5" />
                Previous Slide Content
              </span>
            </label>
            {hasSlideContent ? (
              <div className="rounded-lg bg-base-100 p-3 text-sm text-base-content/80 max-h-32 overflow-y-auto border border-base-300">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {previousSlideContent}
                </pre>
              </div>
            ) : (
              <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  No previous slide content available. Create a slide first to
                  use AI question generation.
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-error/10 p-3 text-sm text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!hasSlideContent || isGenerating || isSubmitting}
            className="btn btn-primary btn-sm w-full gap-2"
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Generating MCQ...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate MCQ from Slide
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
