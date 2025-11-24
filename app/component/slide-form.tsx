"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type SlideFormData = {
  title: string;
  content: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Slide Title</span>
          <span className="label-text-alt text-base-content/60">Required</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a descriptive title for this slide"
          className="input input-bordered w-full"
          required
          disabled={isSubmitting}
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
        <div data-color-mode="light" className="dark:data-[color-mode=dark]">
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
              disabled: isSubmitting,
            }}
          />
        </div>
        <label className="label">
          <span className="label-text-alt text-info">
            💡 Tip: Use the preview pane to see how your content will look
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary gap-2"
          disabled={!content.trim() || !title.trim() || isSubmitting}
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
  );
}
