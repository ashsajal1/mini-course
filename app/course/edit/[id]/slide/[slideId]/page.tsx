"use client";

import { useState, useEffect } from "react";
import { getSlide, updateSlide } from "./actions";
import { notFound, useParams, useRouter } from "next/navigation";
import SlideForm, { SlideFormData } from "@/app/components/slide-form";

type Slide = {
  id: string;
  title: string | null;
  content: string;
};

export default function EditSlidePage() {
  const [slideData, setSlideData] = useState<Slide | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const slideId = params.slideId as string;

  useEffect(() => {
    if (slideId) {
      getSlide(slideId)
        .then((data) => {
          if (!data) {
            notFound();
            return;
          }
          setSlideData(data as Slide);
        })
        .finally(() => setIsLoading(false));
    }
  }, [slideId]);

  const handleSave = async (data: SlideFormData) => {
    setIsSubmitting(true);
    try {
      const response = await updateSlide(
        slideId,
        courseId,
        data.title,
        data.content
      );
      if (response.success) {
        router.push(`/course/edit/${courseId}`);
      }
    } catch (error) {
      console.error("Failed to update slide:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!slideData) {
    return notFound();
  }

  const initialData = {
    title: slideData.title || "",
    content: slideData.content,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-base-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Slide</h3>
        </div>
        <SlideForm
          initialData={initialData}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
          submitButtonText="Update Slide"
        />
      </div>
    </div>
  );
}
