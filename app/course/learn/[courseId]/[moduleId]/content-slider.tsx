"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModuleContent from "./module-content";
import { ContentWithRelations } from "./page";

export default function ContentSlider({
  moduleContent,
}: {
  moduleContent: ContentWithRelations[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = moduleContent.length;

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? prev : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1));
  };

  if (totalSlides === 0) return null;

  return (
    <div className="relative w-full">
      <div className="carousel w-full">
        {moduleContent.map((content, index) => (
          <div
            key={content.id}
            className="carousel-item w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <ModuleContent content={content as ContentWithRelations} />
          </div>
        ))}
      </div>

      {totalSlides > 1 && (
        <>
          {/* Navigation Controls */}
          <div className="mt-8 px-12 py-4 border-t border-base-300 flex justify-between">
            <button
              type="button"
              className="btn btn-outline"
              onClick={goToPrev}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={goToNext}
            >
              Next
            </button>
          </div>
          <div className="text-center mt-4 text-sm text-base-content/70">
            {currentSlide + 1} / {totalSlides}
          </div>
        </>
      )}
    </div>
  );
}
