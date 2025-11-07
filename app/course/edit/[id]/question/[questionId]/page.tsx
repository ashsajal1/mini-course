"use client";

import { useState, useEffect } from "react";
import { Plus as PlusIcon, Trash2 } from "lucide-react";
import { getQuestion, updateQuestion } from "./actions";
import { notFound, useParams, useRouter } from "next/navigation";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
};

type Question = {
  id: string;
  title: string | null;
  content: string;
  options: Option[];
};

export default function EditQuestionPage() {
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const questionId = params.questionId as string;

  useEffect(() => {
    if (questionId) {
      getQuestion(questionId)
        .then((data) => {
          if (!data) {
            notFound();
            return;
          }
          setQuestionData(data as Question);
          setTitle(data.title || "");
          setQuestion(data.content);
          setOptions(data.options.map(opt => ({...opt, explanation: opt.explanation || ""})));
        })
        .finally(() => setIsLoading(false));
    }
  }, [questionId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const response = await updateQuestion(
        questionId,
        courseId,
        title,
        question,
        options.map(({ id, text, isCorrect, explanation }) => ({
          id: questionData?.options.find(o => o.id === id) ? id : undefined,
          text,
          isCorrect,
          explanation: explanation || "",
        }))
      );

      if (response.success) {
        router.push(`/course/edit/${courseId}`);
      }
    } catch (error) {
      console.error("Failed to update question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!questionData) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-base-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Question</h3>
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
              onClick={() => router.back()}
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
              {isSubmitting ? "Updating..." : "Update Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}