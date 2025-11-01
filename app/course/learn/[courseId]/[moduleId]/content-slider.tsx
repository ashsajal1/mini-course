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
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = moduleContent.length;
  const currentContent = moduleContent[currentIndex];

  const goToNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div className="w-full">
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ModuleContent content={currentContent} />
      </div>

      {totalItems > 1 && (
        <div className="mt-8 px-4 py-4 border-t border-base-300">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <button
              type="button"
              className={`btn btn-outline ${currentIndex === 0 ? 'invisible' : ''}`}
              onClick={goToPrev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft className="mr-2" />
              Previous
            </button>
            
            <span className="text-sm text-base-content/70">
              {currentIndex + 1} / {totalItems}
            </span>
            
            <button
              type="button"
              className={`btn btn-primary ${currentIndex === totalItems - 1 ? 'invisible' : ''}`}
              onClick={goToNext}
              disabled={currentIndex === totalItems - 1}
              aria-label="Next slide"
            >
              Next
              <ChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
