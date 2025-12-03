// app/course/learn/[courseId]/[moduleId]/question.tsx
"use client";

import { useState } from "react";
import type { Prisma } from "@prisma/client";

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
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            {question?.content || "Untitled Question"}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="badge badge-primary">MCQ</span>
              <span className="text-base-content/70 text-sm">
                Select the correct answer
              </span>
            </div>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                const isCorrectOption = option.isCorrect;
                const showResult = isSubmitted && (isSelected || isCorrectOption);

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
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${optionStyle} ${
                      !isSubmitted ? "hover:shadow-md" : ""
                    }`}
                    onClick={() => !isSubmitted && handleOptionChange(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                        isSelected
                          ? isCorrect && showResult
                            ? "border-success bg-success text-white"
                            : isSubmitted
                              ? "border-error bg-error text-white"
                              : "border-primary bg-primary text-white"
                          : showResult && isCorrectOption
                            ? "border-success bg-success text-white"
                            : "border-base-content/30"
                      }`}>
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1">{option.text}</span>
                      {showResult && isCorrectOption && (
                        <div className="badge badge-success gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
              <div className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? "bg-success/10 border border-success"
                  : "bg-error/10 border border-error"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}>
                    {isCorrect ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isCorrect ? "text-success" : "text-error"
                    }`}>
                      {isCorrect ? "Correct! Well done!" : "Incorrect. Please try again."}
                    </h3>
                    {question.options[0].explanation && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-base-content/80">Explanation:</p>
                        <p className="text-base-content/70">{question.options[0].explanation}</p>
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
                className={`btn w-full ${
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
