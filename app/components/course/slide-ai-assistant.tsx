"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, FileText, AlertCircle } from "lucide-react";

import { generateSlideContent } from "@/app/course/edit/[id]/slide/ai-actions";

interface SlideAiAssistantProps {
  onContentGenerated: (content: string) => void;
  onTitleGenerated?: (title: string) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export default function SlideAiAssistant({
  onContentGenerated,
  onTitleGenerated,
  onGeneratingChange,
}: SlideAiAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [docs, setDocs] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    onGeneratingChange?.(true);
    setError(null);

    try {
      const result = await generateSlideContent(prompt, docs || undefined);

      if (result.success && result.content) {
        onContentGenerated(result.content);

        // Use title from server action
        if (result.title && onTitleGenerated) {
          onTitleGenerated(result.title);
        }
      } else {
        setError(result.error || "Failed to generate content");
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
          {/* Prompt Input */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">Slide Topic</span>
              <span className="text-xs text-base-content/50">Required</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Explain JavaScript promises with examples"
              className="textarea textarea-bordered w-full resize-none"
              rows={3}
              disabled={isGenerating}
            />
          </div>

          {/* Documentation Input */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5" />
                Documentation
              </span>
              <span className="text-xs text-base-content/50">Optional</span>
            </label>
            <textarea
              value={docs}
              onChange={(e) => setDocs(e.target.value)}
              placeholder="Paste any reference docs or context here..."
              className="textarea textarea-bordered w-full resize-none font-mono text-xs"
              rows={4}
              disabled={isGenerating}
            />
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
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary btn-sm w-full gap-2"
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
