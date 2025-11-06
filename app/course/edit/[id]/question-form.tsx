"use client";

import { useState } from "react";
import { X, Plus as PlusIcon, Trash2 } from "lucide-react";
import { createQuestion } from "./actions";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
};

export default function QuestionForm({
  moduleId,
  onClose,
  onSuccess,
}: {
  moduleId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: crypto.randomUUID(), text: "", isCorrect: false, explanation: "" },
    { id: crypto.randomUUID(), text: "", isCorrect: false, explanation: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    setOptions([
      ...options,
      { id: crypto.randomUUID(), text: "", isCorrect: false, explanation: "" },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return; // Keep at least 2 options
    setOptions(options.filter((option) => option.id !== id));
  };

  const updateOption = (id: string, updates: Partial<Option>) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, ...updates } : option
      )
    );
  };

  const toggleCorrect = (id: string) => {
    // If the option is already correct, unset it
    // Otherwise, unset all other correct options and set this one as correct
    setOptions(
      options.map((option) => ({
        ...option,
        isCorrect: option.id === id ? !option.isCorrect : false,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !question.trim() || options.some(opt => !opt.text.trim())) {
      return; // Basic validation
    }
    
    if (!options.some(opt => opt.isCorrect)) {
      return; // At least one correct answer is required
    }

    setIsSubmitting(true);
    try {
      const response = await createQuestion(
        moduleId,
        title,
        question,
        options.map(({ text, isCorrect, explanation }) => ({
          text,
          isCorrect,
          explanation: explanation || "",
        }))
      );

      if (response.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create New Question</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isSubmitting}
            aria-label="Close question form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter question title"
              className="input input-bordered w-full"
              autoFocus
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question content"
              className="textarea textarea-bordered w-full min-h-[100px]"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="label">
                <span className="label-text">Options</span>
              </label>
              <button
                type="button"
                onClick={addOption}
                className="btn btn-ghost btn-sm"
                disabled={options.length >= 5 || isSubmitting}
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Option
              </button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="bg-base-200 p-3 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => toggleCorrect(option.id)}
                      className="checkbox checkbox-primary"
                      disabled={isSubmitting}
                      id={`correct-${option.id}`}
                    />
                    <label
                      htmlFor={`correct-${option.id}`}
                      className="text-sm cursor-pointer"
                    >
                      Correct Answer
                    </label>
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        className="ml-auto text-error"
                        disabled={isSubmitting}
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      updateOption(option.id, { text: e.target.value })
                    }
                    placeholder={`Option ${index + 1}`}
                    className="input input-bordered w-full mb-2"
                    disabled={isSubmitting}
                    required
                  />
                  <input
                    type="text"
                    value={option.explanation}
                    onChange={(e) =>
                      updateOption(option.id, { explanation: e.target.value })
                    }
                    placeholder="Explanation (optional)"
                    className="input input-bordered w-full text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
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
              disabled={
                isSubmitting ||
                !title.trim() ||
                !question.trim() ||
                options.some((opt) => !opt.text.trim()) ||
                !options.some((opt) => opt.isCorrect)
              }
            >
              {isSubmitting ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}