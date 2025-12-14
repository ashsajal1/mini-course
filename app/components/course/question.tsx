// app/course/learn/[courseId]/[moduleId]/question.tsx
"use client";

import { useState } from "react";
import type { Prisma } from "@prisma/client";
import { Edit } from "lucide-react";
import Link from "next/link";

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: {
    options: true;
    content_item: true;
  };
}>;

interface QuestionProps {
  question: QuestionWithOptions;
  isCreator?: boolean;
  courseId?: string;
  onComplete?: () => void;
}

export default function Question({
  question,
  isCreator,
  courseId,
  onComplete,
}: QuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">Question not found</h2>
            <p>Sorry, we couldn&apos;t find the requested question.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleOptionChange = (optionId: string) => {
    // For multiple choice questions, we'll allow selecting only one option
    // and toggle the selection if the same option is clicked again
    setSelectedOptions(
      (prev) =>
        prev.includes(optionId)
          ? [] // Deselect if clicking the same option
          : [optionId] // Select the new option
    );
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    console.log("Selected options:", selectedOptions);
    if (onComplete) {
      onComplete();
    }
  };

  const isAnswerCorrect = (): boolean | null => {
    if (!isSubmitted) return null;
    const correctAnswers = question.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id);
    return (
      selectedOptions.length === correctAnswers.length &&
      selectedOptions.every((opt) => correctAnswers.includes(opt))
    );
  };

  const isCorrect = isAnswerCorrect();
  const showFeedback = isSubmitted && isCorrect !== null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex-1">
              <div className="flex justify-between items-start gap-3">
                <h2 className="card-title text-2xl">
                  {question?.content || "Untitled Question"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">MCQ</span>
                  {isCreator && courseId && question && (
                    <Link
                      href={`/course/edit/${courseId}/question/${question.id}`}
                      className="btn btn-ghost btn-circle btn-sm"
                      title="Edit Question"
                    >
                      <Edit size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isSelected = selectedOptions.includes(option.id);
                const isCorrectOption = option.isCorrect;
                const showResult =
                  isSubmitted && (isSelected || isCorrectOption);

                let optionStyle = "border-base-300 hover:border-primary";

                if (showResult) {
                  if (isCorrectOption) {
                    optionStyle = "border-success bg-success/10";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-error bg-error/10";
                  }
                } else if (isSelected) {
                  optionStyle = "border-primary bg-primary/10";
                }

                return (
                  <div
                    key={option.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${optionStyle} ${
                      !isSubmitted
                        ? "hover:shadow-md hover:border-primary/50"
                        : ""
                    }`}
                    onClick={() =>
                      !isSubmitted && handleOptionChange(option.id)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                          isSelected
                            ? isCorrect && showResult
                              ? "border-success bg-success text-white"
                              : isSubmitted
                              ? "border-error bg-error text-white"
                              : "border-primary bg-primary text-white"
                            : showResult && isCorrectOption
                            ? "border-success bg-success text-white"
                            : "border-base-content/30"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1">{option.text}</span>
                      {showResult && isCorrectOption && (
                        <div className="badge badge-success gap-1 ml-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Correct
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`mt-6 p-5 rounded-xl ${
                  isCorrect
                    ? "bg-success/10 border border-success"
                    : "bg-error/10 border border-error"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    className={`flex-shrink-0 mt-0.5 flex items-center justify-center w-10 h-10 rounded-full ${
                      isCorrect ? "bg-success" : "bg-error"
                    }`}
                  >
                    {isCorrect ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        isCorrect ? "text-success" : "text-error"
                      }`}
                    >
                      {isCorrect
                        ? "Correct! Well done!"
                        : "Incorrect. Please try again."}
                    </h3>
                    {question.options[0].explanation && (
                      <div className="mt-3 text-base-content/90">
                        <p className="font-medium text-base-content/80 mb-1">
                          Explanation:
                        </p>
                        <p>{question.options[0].explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                disabled={isSubmitted || selectedOptions.length === 0}
                onClick={handleSubmit}
                className={`btn w-full sm:w-auto ${
                  isSubmitted
                    ? "btn-disabled"
                    : selectedOptions.length === 0
                    ? "btn-outline"
                    : "btn-primary"
                }`}
              >
                {isSubmitted ? "Answer Submitted" : "Submit Answer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
