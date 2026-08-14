"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FileText,
  Trophy,
  Menu,
  X,
  BookOpen,
  HelpCircle,
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
  const isCurrentItemCompleted =
    currentContent && completedItemIds.has(currentContent.id);
  const isOnLastItem = currentIndex === totalItems - 1;
  const allItemsCompleted = moduleContent.every((item) =>
    completedItemIds.has(item.id)
  );
  const completedCount = moduleContent.filter((item) =>
    completedItemIds.has(item.id)
  ).length;
  const progressPercent =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const handleMarkAsCompleted = (id: string) => {
    setCompletedItemIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

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
            `Module completed! You earned ${result.xpEarned} XP!`,
            { duration: 4000 }
          );
        } else {
          toast.info("Module already completed!", { duration: 3000 });
        }
      } else {
        toast.error(result.error || "Failed to complete module", {
          duration: 3000,
        });
      }
    } catch {
      toast.error("An error occurred. Please try again.", { duration: 3000 });
    } finally {
      setIsCompleting(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-3">
          <BookOpen className="h-12 w-12 text-base-content/20 mx-auto" />
          <p className="text-base-content/50">This module has no content yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-primary text-primary-content shadow-lg shadow-primary/25 flex items-center justify-center active:scale-95 transition-transform"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-base-100 border-r border-base-200
          transform transition-transform duration-300 ease-out
          md:relative md:translate-x-0 md:flex-shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Module Content
            </h2>
            <button
              className="md:hidden btn btn-ghost btn-xs btn-square"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress */}
          <div className="px-4 py-3 border-b border-base-200">
            <div className="flex items-center justify-between text-xs text-base-content/50 mb-1.5">
              <span>{completedCount} of {totalItems} completed</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-base-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-0.5 px-2">
              {moduleContent.map((content, index) => {
                const title =
                  content.slide?.title ||
                  content.question?.content ||
                  "Untitled";
                const isSlide = content.type === "SLIDE";
                const isActive = currentIndex === index;
                const isDone = completedItemIds.has(content.id);

                return (
                  <li key={content.id}>
                    <button
                      onClick={() => handleContentSelect(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-sm transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-base-content/70 hover:bg-base-200/50"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? "bg-success/15 text-success"
                            : isActive
                              ? "bg-primary/15 text-primary"
                              : "bg-base-200 text-base-content/40"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {isSlide ? (
                            <FileText className="h-3 w-3 flex-shrink-0 text-base-content/30" />
                          ) : (
                            <HelpCircle className="h-3 w-3 flex-shrink-0 text-base-content/30" />
                          )}
                          <span className="truncate">{title}</span>
                        </div>
                        <span className="text-[10px] text-base-content/30 uppercase tracking-wider">
                          {isSlide ? "Slide" : "Question"}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sidebar Footer */}
          {isCompleted && (
            <div className="px-4 py-3 border-t border-base-200">
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Module Completed</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl">
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
        </div>

        {/* Bottom Navigation */}
        {totalItems > 1 && (
          <div className="border-t border-base-200 bg-base-100">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1 pt-3">
              {moduleContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-200 rounded-full ${
                    index === currentIndex
                      ? "w-6 h-1.5 bg-primary"
                      : completedItemIds.has(moduleContent[index].id)
                        ? "w-1.5 h-1.5 bg-success"
                        : "w-1.5 h-1.5 bg-base-300 hover:bg-base-content/30"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-4xl mx-auto">
              <button
                type="button"
                className={`btn btn-sm btn-ghost gap-1 ${
                  currentIndex === 0 ? "invisible" : ""
                }`}
                onClick={goToPrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <span className="text-xs text-base-content/40 font-medium tabular-nums">
                {currentIndex + 1} / {totalItems}
              </span>

              {isOnLastItem && !isCompleted ? (
                allItemsCompleted ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success gap-1.5"
                    onClick={handleCompleteModule}
                    disabled={isCompleting}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>{isCompleting ? "Completing..." : "Complete"}</span>
                  </button>
                ) : (
                  <span className="text-xs text-base-content/40">
                    Complete all items
                  </span>
                )
              ) : isOnLastItem && isCompleted ? (
                <button
                  type="button"
                  className="btn btn-sm btn-primary gap-1.5"
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
                      <span>Next Module</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back to Course</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-primary gap-1.5"
                  onClick={goToNext}
                  disabled={!isCurrentItemCompleted}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
