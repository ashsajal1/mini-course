"use client";

import { useState, useEffect } from "react";
import { getQuestion, updateQuestion } from "./actions";
import { notFound, useParams, useRouter } from "next/navigation";
import QuestionForm, {
  QuestionFormData,
  Option,
} from "@/app/component/question-form";

type Question = {
  id: string;
  title: string | null;
  content: string;
  options: Option[];
};

export default function EditQuestionPage() {
  const [questionData, setQuestionData] = useState<Question | null>(null);
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
          const question = {
            ...data,
            options: data.options.map((opt) => ({
              ...opt,
              explanation: opt.explanation || "",
            })),
          };
          setQuestionData(question as Question);
        })
        .finally(() => setIsLoading(false));
    }
  }, [questionId]);

  const handleSave = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await updateQuestion(
        questionId,
        courseId,
        data.title,
        data.question,
        data.options.map(({ id, text, isCorrect, explanation }) => ({
          id: questionData?.options.find((o) => o.id === id) ? id : undefined,
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

  const initialData = {
    title: questionData.title || "",
    question: questionData.content,
    options: questionData.options,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-base-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Question</h3>
        </div>
        <QuestionForm
          initialData={initialData}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
          submitButtonText="Update Question"
        />
      </div>
    </div>
  );
}