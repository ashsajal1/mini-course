"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SlideForm, { SlideFormData } from "@/app/components/course/slide-form";
import { createSlide } from "./actions";

export default function CreateSlidePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const courseId = params.id as string;
  const moduleId = searchParams.get("moduleId");

  const handleSave = async (data: SlideFormData) => {
    if (!moduleId) {
      console.error("Module ID is missing");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createSlide(moduleId, data.title, data.content);
      if (response.success) {
        router.push(`/course/edit/${courseId}`);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error("Failed to create slide:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-base-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create Slide</h3>
        </div>
        <SlideForm
          onSave={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
          submitButtonText="Create Slide"
        />
      </div>
    </div>
  );
}
