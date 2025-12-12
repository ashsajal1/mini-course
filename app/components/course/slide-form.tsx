"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import "@uiw/react-md-editor/markdown-editor.css";
import SlideAiAssistant from "./slide-ai-assistant";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type SlideFormData = {
  title: string;
  content: string;
  references: string[];
};

interface SlideFormProps {
  initialData?: Partial<SlideFormData>;
  onSave: (data: SlideFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}

export default function SlideForm({
  initialData,
  onSave,
  isSubmitting,
  onCancel,
  submitButtonText = "Save",
}: SlideFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [references, setReferences] = useState<string[]>(
    initialData?.references || []
  );
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const { theme } = useTheme();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    onSave({ title, content, references });
    setShowConfirmation(false);
  };

  const addReference = () => {
    setReferences([...references, ""]);
  };

  const removeReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const updateReference = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  const handleAiContentGenerated = (generatedContent: string) => {
    setContent(generatedContent);
  };

  const handleAiTitleGenerated = (generatedTitle: string) => {
    if (!title.trim()) {
      setTitle(generatedTitle);
    }
  };

  const initialTitle = initialData?.title || "";
  const initialContent = initialData?.content || "";
  const initialReferences = initialData?.references || [];

  const isDirty =
    title !== initialTitle ||
    content !== initialContent ||
    JSON.stringify(references) !== JSON.stringify(initialReferences);

  const isDisabled = isSubmitting || isAiGenerating;

  const getChangesSummary = () => {
    const changes = [];
    if (title !== initialTitle) changes.push("Title");
    if (content !== initialContent) changes.push("Content");
    if (JSON.stringify(references) !== JSON.stringify(initialReferences))
      changes.push("References");
    return changes;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AI Assistant */}
        <SlideAiAssistant
          onContentGenerated={handleAiContentGenerated}
          onTitleGenerated={handleAiTitleGenerated}
          onGeneratingChange={setIsAiGenerating}
        />

        {/* Title Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Slide Title</span>
            <span className="label-text-alt text-base-content/60">
              Required
            </span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title for this slide"
            className="input input-bordered w-full"
            required
            disabled={isDisabled}
          />
        </div>

        {/* Markdown Editor */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Slide Content</span>
            <span className="label-text-alt text-base-content/60">
              Markdown supported
            </span>
          </label>
          <div data-color-mode={theme}>
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview="live"
              height={400}
              visibleDragbar={false}
              textareaProps={{
                placeholder: `# Write your slide content here
  
  Use **markdown** syntax to format your content:
  - Lists
  - **Bold** and *italic* text
  - [Links](https://example.com)
  - Code blocks
  - And more!`,
                disabled: isDisabled,
              }}
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-info">
              💡 Tip: Use the preview pane to see how your content will look
            </span>
          </label>
        </div>

        {/* References Section */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">
              References & Resources
            </span>
            <span className="label-text-alt text-base-content/60">
              Optional links or citations
            </span>
          </label>

          <div className="space-y-3">
            {references.map((ref, index) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => updateReference(index, e.target.value)}
                    placeholder="https://example.com or Reference Text"
                    className="input input-bordered w-full pl-10"
                    disabled={isDisabled}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="btn btn-ghost btn-square text-error"
                  disabled={isDisabled}
                  title="Remove reference"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addReference}
              className="btn btn-outline btn-sm gap-2"
              disabled={isDisabled}
            >
              <Plus className="w-4 h-4" />
              Add Reference
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isDisabled}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary gap-2"
            disabled={
              !content.trim() || !title.trim() || isDisabled || !isDirty
            }
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Changes</h3>
            <div className="py-4">
              <p className="mb-2">The following sections satisfy updates:</p>
              <ul className="list-disc list-inside space-y-1">
                {getChangesSummary().map((change) => (
                  <li key={change} className="text-secondary font-medium">
                    {change} Modified
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-base-content/70">
                Are you sure you want to {submitButtonText.toLowerCase()}?
              </p>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : null}
                Confirm Update
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowConfirmation(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
