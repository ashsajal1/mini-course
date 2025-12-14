"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Type,
  Trophy,
  Menu,
  X,
} from "lucide-react";
import { ContentWithRelations } from "./page";
import { completeModule } from "./actions";
import ModuleContent from "@/app/components/course/module-content";
import { toast } from "sonner";

export default function LearnModuleView({
  moduleContent,
  moduleId,
  courseId,
  isCompleted: initialIsCompleted,
  nextModuleId,
  isCreator,
}: {
  moduleContent: ContentWithRelations[];
  moduleId: string;
  courseId: string;
  isCompleted: boolean;
  nextModuleId: string | null;
  isCreator: boolean;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(
    new Set()
  );
  const totalItems = moduleContent.length;
  const currentContent = moduleContent[currentIndex];
  // Determine if the current item is completed
  const isCurrentItemCompleted =
    currentContent && completedItemIds.has(currentContent.id);

  const isOnLastItem = currentIndex === totalItems - 1;
  const allItemsCompleted = moduleContent.every((item) =>
    completedItemIds.has(item.id)
  );

  const handleMarkAsCompleted = (id: string) => {
    setCompletedItemIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  // Auto-complete slides when viewed
  useEffect(() => {
    if (currentContent && currentContent.type === "SLIDE") {
      handleMarkAsCompleted(currentContent.id);
    }
  }, [currentContent]);

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
    setIsSidebarOpen(false);
  };

  const handleCompleteModule = async () => {
    setIsCompleting(true);
    try {
      const result = await completeModule(moduleId, courseId);

      if (result.success) {
        setIsCompleted(true);
        if (result.xpEarned && result.xpEarned > 0) {
          toast.success(
            `🎉 Module completed! You earned ${result.xpEarned} XP!`,
            {
              duration: 4000,
            }
          );
        } else {
          toast.info("Module already completed!", {
            duration: 3000,
          });
        }
      } else {
        toast.error(result.error || "Failed to complete module", {
          duration: 3000,
        });
      }
    } catch {
      toast.error("An error occurred. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="text-center p-8">This module has no content yet.</div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 btn btn-circle btn-primary shadow-lg"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-base-100 border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Module Content</h2>
            <button
              className="md:hidden btn btn-ghost btn-sm btn-circle"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
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
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
          {currentContent && (
            <ModuleContent
              key={currentContent.id}
              content={currentContent}
              isCreator={isCreator}
              courseId={courseId}
              onComplete={() => handleMarkAsCompleted(currentContent.id)}
            />
          )}
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
                <ChevronLeft className="md:mr-2" />
                <span className="hidden md:inline">Previous</span>
              </button>

              <span className="text-sm text-base-content/70">
                {currentIndex + 1} / {totalItems}
              </span>

              {isOnLastItem && !isCompleted ? (
                allItemsCompleted && (
                  <button
                    type="button"
                    className="btn btn-success md:gap-2"
                    onClick={handleCompleteModule}
                    disabled={isCompleting}
                    aria-label="Complete module"
                  >
                    <Trophy className="w-5 h-5" />
                    <span className="hidden md:inline">
                      {isCompleting ? "Completing..." : "Complete Module"}
                    </span>
                  </button>
                )
              ) : isOnLastItem && isCompleted ? (
                <button
                  type="button"
                  className="btn btn-primary md:gap-2"
                  onClick={() => {
                    if (nextModuleId) {
                      router.push(`/course/learn/${courseId}/${nextModuleId}`);
                    } else {
                      router.push(`/course/learn/${courseId}`);
                    }
                  }}
                >
                  {nextModuleId ? (
                    <>
                      <span className="hidden md:inline">Next Module</span>
                      <ChevronRight className="md:ml-2" />
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="md:mr-2" />
                      <span className="hidden md:inline">Back to Course</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary md:gap-2"
                  onClick={goToNext}
                  disabled={
                    currentIndex === totalItems - 1 || !isCurrentItemCompleted
                  }
                  aria-label="Next slide"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="md:ml-2" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
