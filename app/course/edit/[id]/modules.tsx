"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { Module } from "@prisma/client";
import {
  createModule,
  deleteModule,
  deleteSlide,
  deleteQuestion,
  updateSlide,
  updateQuestionContent,
} from "./actions";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import components with no SSR
const SlideForm = dynamic(() => import("./slide-form"), { ssr: false });

const QuestionForm = dynamic(() => import("./question-form"), { ssr: false });

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
  questions?: { id: string; title: string | null; content?: string }[];
};

interface ModulesProps {
  modules: ModuleWithItems[];
  courseId: string;
}

export default function Modules({ modules, courseId }: ModulesProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editState, setEditState] = useState<{
    isOpen: boolean;
    type: "slide" | "question" | null;
    id: string;
    moduleId: string;
    title: string;
    content: string;
  }>({
    isOpen: false,
    type: null,
    id: "",
    moduleId: "",
    title: "",
    content: "",
  });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    type: null,
    id: "",
    title: "",
    moduleId: "",
  });

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const router = useRouter();

  const handleAddSlide = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setShowSlideForm(true);
  };

  const openEditDialog = (
    type: "slide" | "question",
    item: { id: string; title?: string | null; content?: string },
    moduleId: string
  ) => {
    setEditState({
      isOpen: true,
      type,
      id: item.id,
      moduleId,
      title: item.title || "",
      content: item.content || "",
    });
  };

  const closeEditDialog = () => {
    setEditState({
      isOpen: false,
      type: null,
      id: "",
      moduleId: "",
      title: "",
      content: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editState.type || !editState.id) return;
    try {
      setIsSavingEdit(true);
      if (editState.type === "slide") {
        await updateSlide(editState.id, editState.title, editState.content);
      } else {
        await updateQuestionContent(editState.id, editState.content);
      }
      closeEditDialog();
      router.refresh();
    } catch (e) {
      console.error("Failed to save edits", e);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleAddQuestion = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setShowQuestionForm(true);
  };

  const handleFormSuccess = () => {
    setShowSlideForm(false);
    setShowQuestionForm(false);
    router.refresh();
  };

  const closeAllForms = () => {
    setShowSlideForm(false);
    setShowQuestionForm(false);
  };

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

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      const response = await createModule(courseId, newModuleTitle);

      if (response.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create module:", error);
    }
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

        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create New Module</h3>
              <form onSubmit={handleCreateModule}>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text">Module Title</span>
                  </label>
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Enter module title"
                    className="input input-bordered w-full"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewModuleTitle("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Module</h3>
            <form onSubmit={handleCreateModule}>
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Module Title</span>
                </label>
                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="Enter module title"
                  className="input input-bordered w-full"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewModuleTitle("");
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleAddSlide(module.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slide
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleAddQuestion(module.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Question
                    </button>
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
                                <button
                                  className="btn btn-ghost btn-xs"
                                  onClick={() =>
                                    openEditDialog("slide", s, module.id)
                                  }
                                >
                                  Edit Slide
                                </button>
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
                                <button
                                  className="btn btn-ghost btn-xs"
                                  onClick={() =>
                                    openEditDialog("question", q, module.id)
                                  }
                                >
                                  Edit Question
                                </button>
                                <button
                                  className="btn btn-ghost btn-xs text-error"
                                  onClick={() =>
                                    openDeleteDialog(
                                      "question",
                                      q.id,
                                      q.title || "Untitled Question",
                                      module.id
                                    )
                                  }
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

      {showSlideForm && selectedModuleId && (
        <SlideForm
          moduleId={selectedModuleId}
          onClose={closeAllForms}
          onSuccess={handleFormSuccess}
        />
      )}

      {showQuestionForm && selectedModuleId && (
        <QuestionForm
          moduleId={selectedModuleId}
          onClose={closeAllForms}
          onSuccess={handleFormSuccess}
        />
      )}

      <DeleteDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete ${deleteState.type || "item"}`}
        description={`Are you sure you want to delete "${deleteState.title}"? This action cannot be undone.`}
        isLoading={false}
      />

      {editState.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editState.type === "slide" ? "Edit Slide" : "Edit Question"}
              </h3>
              <button
                onClick={closeEditDialog}
                className="btn btn-ghost btn-sm"
                disabled={isSavingEdit}
              >
                Close
              </button>
            </div>

            <div className="form-control w-full mb-4">
              {editState.type === "slide" && (
                <>
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                  aria-label="input"
                    type="text"
                    value={editState.title}
                    onChange={(e) =>
                      setEditState((s) => ({ ...s, title: e.target.value }))
                    }
                    className="input input-bordered w-full mb-4"
                    disabled={isSavingEdit}
                  />
                </>
              )}

              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                aria-label="Textrea for slide"
                value={editState.content}
                onChange={(e) =>
                  setEditState((s) => ({ ...s, content: e.target.value }))
                }
                className="textarea textarea-bordered w-full min-h-[200px]"
                disabled={isSavingEdit}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditDialog}
                className="btn btn-ghost"
                disabled={isSavingEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn btn-primary"
                disabled={
                  isSavingEdit ||
                  (editState.type === "slide"
                    ? !editState.title.trim()
                    : !editState.content.trim())
                }
              >
                {isSavingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
