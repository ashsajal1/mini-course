"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Slide Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter slide title"
          className="input input-bordered w-full mb-4"
          required
          disabled={isSubmitting}
        />

        <label className="label">
          <span className="label-text">Slide Content</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter slide content (markdown supported)"
          className="textarea textarea-bordered w-full min-h-[200px]"
          autoFocus
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end gap-2">
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
          className="btn btn-primary"
          disabled={!content.trim() || !title.trim() || isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
