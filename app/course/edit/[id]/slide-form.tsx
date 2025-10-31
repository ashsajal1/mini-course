"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createSlide } from "./actions";

export default function SlideForm({
  moduleId,
  onClose,
  onSuccess,
}: {
  moduleId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await createSlide(moduleId, content);
      if (response.success) {
        setContent("");
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create slide:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create New Slide</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isSubmitting}
            aria-label="Close slide form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
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
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Slide"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
