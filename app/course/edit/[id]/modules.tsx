"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { Module } from "@prisma/client";
import {
  deleteModule,
  deleteSlide,
  deleteQuestion,
} from "./actions";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import CreateModuleDialog from "./create-module-dialog";

const DeleteDialog = dynamic(() => import("./delete-dialog"), { ssr: false });

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

      <div className="space-y-2">
        {modules.map((module) => (
          <div key={module.id} className="collapse bg-base-200">
            <input
              type="checkbox"
              checked={activeModule === module.id}
              onChange={() => toggleModule(module.id)}
              className="hidden"
              id={`module-${module.id}`}
            />
            <label
              htmlFor={`module-${module.id}`}
              className="collapse-title text-lg font-medium flex justify-between items-center cursor-pointer p-4"
            >
              <span>{module.title}</span>
              {activeModule === module.id ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </label>
            <div className="collapse-content">
              <div className="p-4 pt-2 space-y-4">
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Link
                      href={`/course/edit/${courseId}/slide?moduleId=${module.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slide
                    </Link>
                    <Link
                      href={`/course/edit/${courseId}/question?moduleId=${module.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Question
                    </Link>
                    <div className="divider divider-horizontal my-0">OR</div>
                    <button
                      className="btn btn-ghost btn-sm text-error gap-1"
                      onClick={() =>
                        openDeleteDialog("module", module.id, module.title)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Module
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(module.slides?.length ?? 0) > 0 && (
                      <div className="space-y-1">
                        {module.slides!.map((s) => (
                          <div
                            key={s.id}
                            className="collapse collapse-arrow bg-base-200"
                          >
                            <input
                              type="checkbox"
                              aria-label={`Toggle slide details: ${
                                s.title || "Untitled Slide"
                              }`}
                            />
                            <div className="collapse-title text-sm font-medium">
                              {s.title || "Untitled Slide"}
                            </div>
                            <div className="collapse-content">
                              {s.content && (
                                <p className="text-xs text-base-content/70 mb-2">
                                  {s.content.length > 120
                                    ? s.content.slice(0, 120) + "…"
                                    : s.content}
                                </p>
                              )}
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/course/edit/${module.id}/slide/${s.id}`}
                                  className="btn btn-ghost btn-xs"
                                >
                                  Edit Slide
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
                                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                                  Slide
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(module.questions?.length ?? 0) > 0 && (
                      <div className="space-y-1">
                        {module.questions!.map((q) => (
                          <div
                            key={q.id}
                            className="collapse collapse-arrow bg-base-200"
                          >
                            <input
                              type="checkbox"
                              aria-label={`Toggle question details: ${
                                q.title || "Untitled Question"
                              }`}
                            />
                            <div className="collapse-title text-sm font-medium">
                              {q.title || "Untitled Question"}
                            </div>
                            <div className="collapse-content">
                              {q.content && (
                                <p className="text-xs text-base-content/70 mb-2">
                                  {q.content.length > 120
                                    ? q.content.slice(0, 120) + "…"
                                    : q.content}
                                </p>
                              )}
                              <div className="flex justify-end gap-2">
                                <Link
                                  className="btn btn-ghost btn-xs"
                                  href={`/course/edit/${module.id}/question/${q.id}`}
                                >
                                  Edit Question
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
                                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                                  Question
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
