"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { generateSlideContent } from "@/app/course/edit/[id]/slide/ai-actions";

interface SlideAiAssistantProps {
  onContentGenerated: (content: string) => void;
  onTitleGenerated?: (title: string) => void;
}

export default function SlideAiAssistant({
  onContentGenerated,
  onTitleGenerated,
}: SlideAiAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [docs, setDocs] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateSlideContent(prompt, docs || undefined);

      if (result.success && result.content) {
        onContentGenerated(result.content);

        // Try to extract title from the first heading
        const titleMatch = result.content.match(/^#\s+(.+)$/m);
        if (titleMatch && onTitleGenerated) {
          onTitleGenerated(titleMatch[1]);
        }
      } else {
        setError(result.error || "Failed to generate content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn btn-outline btn-sm gap-2 w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Assistant
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Expandable Panel */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-base-200 rounded-lg border border-base-300 space-y-4">
          <p className="text-sm text-base-content/70">
            Describe what you want to create and optionally paste documentation
            for context.
          </p>

          {/* Prompt Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                <Sparkles className="w-3 h-3 inline mr-1" />
                What should this slide cover?
              </span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Explain JavaScript promises with examples"
              className="textarea textarea-bordered h-20 resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Documentation Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                <FileText className="w-3 h-3 inline mr-1" />
                Documentation / Context (optional)
              </span>
            </label>
            <textarea
              value={docs}
              onChange={(e) => setDocs(e.target.value)}
              placeholder="Paste documentation, code snippets, or any context here..."
              className="textarea textarea-bordered h-28 resize-none font-mono text-xs"
              disabled={isGenerating}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary btn-sm gap-2"
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
