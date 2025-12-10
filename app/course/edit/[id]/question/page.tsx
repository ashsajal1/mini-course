"use client";

import QuestionForm, {
  QuestionFormData,
} from "@/app/components/course/question-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createQuestion, getPreviousSlideContent } from "./actions";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousSlideContent, setPreviousSlideContent] = useState<
    string | null
  >(null);

  const courseId = params.id as string;
  const moduleId = searchParams.get("moduleId");

  // Fetch previous slide content when component mounts
  useEffect(() => {
    const fetchPreviousSlide = async () => {
      if (moduleId) {
        const content = await getPreviousSlideContent(moduleId);
        setPreviousSlideContent(content);
      }
    };
    fetchPreviousSlide();
  }, [moduleId]);

  const handleSave = async (data: QuestionFormData) => {
    if (!moduleId) {
      // Handle case where moduleId is missing
      console.error("Module ID is missing");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createQuestion(
        moduleId,
        data.title,
        data.question,
        data.options
      );
      if (response.success) {
        router.push(`/course/edit/${courseId}`);
      }
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-base-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create Question</h3>
        </div>
        <QuestionForm
          onSave={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
          submitButtonText="Create Question"
          previousSlideContent={previousSlideContent ?? undefined}
        />
      </div>
    </div>
  );
}
