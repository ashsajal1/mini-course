// app/course/learn/[courseId]/[moduleId]/question.tsx
"use client";

import { useState } from "react";
import type { Prisma } from "@/app/generated/prisma/client";

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: {
    options: true;
    content_item: true;
  };
}>;

interface QuestionProps {
  question: QuestionWithOptions;
}

export default function Question({ question }: QuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!question) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
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
    <div className="container mx-auto p-4 ">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            {question?.content || "Untitled Question"}
          </h2>

          <div className="mt-4 space-y-4">
            <p className="text-lg">{question.content}</p>

            <div className="form-control">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="label cursor-pointer justify-start gap-3"
                >
                  <input
                    type="radio"
                    name="options"
                    className="radio radio-primary"
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionChange(option.id)}
                    disabled={isSubmitted}
                  />
                  <span
                    className={`label-text ${
                      isSubmitted && option.isCorrect
                        ? "text-success font-medium"
                        : ""
                    }`}
                  >
                    {option.text}
                  </span>
                </label>
              ))}
            </div>

            {showFeedback && (
              <div
                className={`alert ${
                  isCorrect ? "alert-success" : "alert-error"
                } mt-4`}
              >
                {isCorrect ? (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Correct! Well done!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Incorrect. Please try again.</span>
                  </div>
                )}

                {question.options[0].explanation && (
                  <div className="mt-2 text-sm">
                    <p className="font-bold">Explanation:</p>
                    <p>{question.options[0].explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
