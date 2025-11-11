"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Type } from "lucide-react";
import ModuleContent from "./module-content";
import { ContentWithRelations } from "./page";

export default function LearnModuleView({
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

  const handleContentSelect = (index: number) => {
    setCurrentIndex(index);
  };

  if (totalItems === 0) {
    return (
      <div className="text-center p-8">
        This module has no content yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r p-4">
        <h2 className="text-lg font-bold mb-4">Module Content</h2>
        <ul className="space-y-2">
          {moduleContent.map((content, index) => {
            const title =
              content.slide?.title || content.question?.content || "Untitled";
            const isSlide = content.type === "SLIDE";
            return (
              <li key={content.id}>
                <button
                  onClick={() => handleContentSelect(index)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    currentIndex === index
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-200"
                  }`}
                >
                  {isSlide ? <Type size={18} /> : <CheckCircle size={18} />}
                  <span className="truncate flex-1">{title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
      <main className="flex-1">
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          {currentContent && <ModuleContent content={currentContent} />}
        </div>

        {totalItems > 1 && (
          <div className="mt-8 px-4 py-4 border-t border-base-300">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <button
                type="button"
                className={`btn btn-outline ${
                  currentIndex === 0 ? "invisible" : ""
                } md:gap-2`}
                onClick={goToPrev}
                disabled={currentIndex === 0}
                aria-label="Previous slide"
              >
                <ChevronLeft className="mdmr-2" />
                <span className="hidden md:inline">Previous</span>
              </button>

              <span className="text-sm text-base-content/70">
                {currentIndex + 1} / {totalItems}
              </span>

              <button
                type="button"
                className={`btn btn-primary ${
                  currentIndex === totalItems - 1 ? "invisible" : ""
                } md:gap-2`}
                onClick={goToNext}
                disabled={currentIndex === totalItems - 1}
                aria-label="Next slide"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="md:ml-2" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
