"use client";

import { useState } from "react";
import { Plus as PlusIcon, Trash2 } from "lucide-react";
import QuestionAiAssistant from "./question-ai-assistant";

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
};

export type QuestionFormData = {
  title: string;
  question: string;
  options: Option[];
};

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  onSave: (data: QuestionFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  previousSlideContent?: string;
}

export default function QuestionForm({
  initialData,
  onSave,
  isSubmitting,
  onCancel,
  submitButtonText = "Save",
  previousSlideContent,
}: QuestionFormProps) {
  const [title, setTitle] = useState(() => initialData?.title ?? "");
  const [question, setQuestion] = useState(() => initialData?.question ?? "");
  const [options, setOptions] = useState<Option[]>(
    () => initialData?.options ?? []
  );
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiQuestionGenerated = (data: {
    title: string;
    question: string;
    options: Option[];
  }) => {
    setTitle(data.title);
    setQuestion(data.question);
    setOptions(data.options);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: crypto.randomUUID(), text: "", isCorrect: false, explanation: "" },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
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
    setOptions(
      options.map((option) => ({
        ...option,
        isCorrect: option.id === id ? !option.isCorrect : false,
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !question.trim() ||
      options.some((opt) => !opt.text.trim())
    ) {
      return; // Basic validation
    }

    if (!options.some((opt) => opt.isCorrect)) {
      return; // At least one correct answer is required
    }

    onSave({ title, question, options });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Assistant for MCQ Generation */}
      <QuestionAiAssistant
        previousSlideContent={previousSlideContent}
        onQuestionGenerated={handleAiQuestionGenerated}
        onGeneratingChange={setIsAiGenerating}
      />

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
          disabled={isSubmitting || isAiGenerating}
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
              <div className="flex gap-2 mb-2 items-center">
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
          onClick={onCancel}
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
          {isSubmitting ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
