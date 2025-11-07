"use client";

import { useState, useEffect } from "react";
import { getSlide, updateSlide } from "./actions";
import { notFound, useParams, useRouter } from "next/navigation";

type Slide = {
  id: string;
  title: string | null;
  content: string;
};

export default function EditSlidePage() {
  const [slideData, setSlideData] = useState<Slide | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
          setTitle(data.title || "");
          setContent(data.content);
        })
        .finally(() => setIsLoading(false));
    }
  }, [slideId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await updateSlide(slideId, courseId, title, content);
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-base-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Slide</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Slide Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter slide title"
              className="input input-bordered w-full mb-4"
              required
              disabled={isSubmitting}
            />
            
            <label className="label">
              <span className="label-text">Slide Content</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter slide content (markdown supported)"
              className="textarea textarea-bordered w-full min-h-[200px]"
              autoFocus
              disabled={isSubmitting}
            />
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
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Slide"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}