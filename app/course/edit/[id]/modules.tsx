"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { Module } from "@prisma/client";
import { deleteModule, deleteSlide, deleteQuestion } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateModuleDialog from "@/app/components/course/create-module-dialog";
import dynamic from "next/dynamic";

const DeleteDialog = dynamic(
  () => import("@/app/components/course/delete-dialog"),
  { ssr: false }
);

type DeleteType = "module" | "slide" | "question";

interface DeleteState {
  isOpen: boolean;
  type: DeleteType | null;
  id: string;
  title: string;
  moduleId?: string;
}

type ModuleWithItems = Module & {
  slides?: { id: string; title: string | null; content?: string }[];
  questions?: {
    id: string;
    title: string | null;
    content?: string;
    options?: {
      id: string;
      text: string;
      isCorrect: boolean;
      explanation: string | null;
    }[];
  }[];
};

interface ModulesProps {
  modules: ModuleWithItems[];
  courseId: string;
}

export default function Modules({ modules, courseId }: ModulesProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    type: null,
    id: "",
    title: "",
    moduleId: "",
  });

  const router = useRouter();

  const openDeleteDialog = (
    type: DeleteType,
    id: string,
    title: string,
    moduleId?: string
  ) => {
    setDeleteState({
      isOpen: true,
      type,
      id,
      title,
      moduleId,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDelete = async () => {
    const { type, id } = deleteState;
    if (!type || !id) return;

    try {
      let success = false;

      switch (type) {
        case "module":
          const moduleResponse = await deleteModule(id);
          success = moduleResponse.success;
          break;

        case "slide":
          const slideResponse = await deleteSlide(id);
          success = slideResponse.success;
          break;

        case "question":
          const questionResponse = await deleteQuestion(id);
          success = questionResponse.success;
          break;
      }

      if (success) {
        closeDeleteDialog();
        router.refresh();
      }
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const toggleModule = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-base-content/30" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No modules yet</h2>
          <p className="text-base-content/70 mb-6">
            Create your first module to start adding content
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Module
          </button>
        </div>

        <CreateModuleDialog
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          courseId={courseId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Modules</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="btn btn-primary btn-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          New Module
        </button>
      </div>

      <CreateModuleDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        courseId={courseId}
      />

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, index) => (
          <div key={module.id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {/* Module Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{module.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="badge badge-outline gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {module.slides?.length || 0} Slides
                      </div>
                      <div className="badge badge-outline gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {module.questions?.length || 0} Questions
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleModule(module.id)}
                  className="btn btn-ghost btn-sm gap-2"
                >
                  {activeModule === module.id ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show
                    </>
                  )}
                </button>
              </div>

              {/* Module Content - Shown when expanded */}
              {activeModule === module.id && (
                <div className="space-y-4 pt-4 border-t border-base-300">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/course/edit/${courseId}/slide?moduleId=${module.id}`}
                      className="btn btn-outline btn-sm gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slide
                    </Link>
                    <Link
                      href={`/course/edit/${courseId}/question?moduleId=${module.id}`}
                      className="btn btn-outline btn-sm gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </Link>
                    <div className="flex-1"></div>
                    <button
                      className="btn btn-ghost btn-sm text-error gap-2"
                      onClick={() =>
                        openDeleteDialog("module", module.id, module.title)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Module
                    </button>
                  </div>

                  {/* Slides List */}
                  {(module.slides?.length ?? 0) > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-base-content/70 uppercase tracking-wide">
                        Slides
                      </h4>
                      {module.slides!.map((s) => (
                        <div
                          key={s.id}
                          className="card bg-base-200 hover:bg-base-300 transition-colors"
                        >
                          <div className="card-body p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {s.title || "Untitled Slide"}
                                </h5>
                                {s.content && (
                                  <p className="text-sm text-base-content/60 mt-1">
                                    {s.content.length > 100
                                      ? s.content.slice(0, 100) + "…"
                                      : s.content}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  href={`/course/edit/${module.id}/slide/${s.id}`}
                                  className="btn btn-ghost btn-xs"
                                >
                                  Edit
                                </Link>
                                <button
                                  className="btn btn-ghost btn-xs text-error"
                                  onClick={() =>
                                    openDeleteDialog(
                                      "slide",
                                      s.id,
                                      s.title || "Untitled Slide",
                                      module.id
                                    )
                                  }
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Questions List */}
                  {(module.questions?.length ?? 0) > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-base-content/70 uppercase tracking-wide">
                        Questions
                      </h4>
                      {module.questions!.map((q) => (
                        <div
                          key={q.id}
                          className="card bg-base-200 hover:bg-base-300 transition-colors"
                        >
                          <div className="card-body p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {q.title || "Untitled Question"}
                                </h5>
                                {q.content && (
                                  <p className="text-sm text-base-content/60 mt-1">
                                    {q.content.length > 100
                                      ? q.content.slice(0, 100) + "…"
                                      : q.content}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  className="btn btn-ghost btn-xs"
                                  href={`/course/edit/${module.id}/question/${q.id}`}
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() =>
                                    openDeleteDialog(
                                      "question",
                                      q.id,
                                      q.title || "Untitled Question",
                                      module.id
                                    )
                                  }
                                  className="btn btn-ghost btn-xs text-error"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <DeleteDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete ${deleteState.type || "item"}`}
        description={`Are you sure you want to delete "${deleteState.title}"? This action cannot be undone.`}
        isLoading={false}
      />
    </div>
  );
}
