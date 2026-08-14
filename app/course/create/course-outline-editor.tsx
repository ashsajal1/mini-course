"use client";

import { useState, useEffect } from "react";
import {
  CourseOutline,
  ModuleOutline,
  SlideOutline,
  QuestionOutline,
} from "@/lib/course-ai-service";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Edit3,
  Save,
  X,
  Eye,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Target,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface CourseOutlineEditorProps {
  initialOutline: CourseOutline;
  onOutlineChanged: (outline: CourseOutline) => void;
  onProceed: () => void;
}

export default function CourseOutlineEditor({
  initialOutline,
  onOutlineChanged,
  onProceed,
}: CourseOutlineEditorProps) {
  const [outline, setOutline] = useState<CourseOutline>(initialOutline);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
  );
  const [previewModule, setPreviewModule] = useState<number | null>(null);

  useEffect(() => {
    onOutlineChanged(outline);
  }, [outline, onOutlineChanged]);

  const updateOutline = (updates: Partial<CourseOutline>) => {
    setOutline((prev) => ({ ...prev, ...updates }));
  };

  const updateModule = (index: number, updates: Partial<ModuleOutline>) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === index ? { ...module, ...updates } : module
      ),
    }));
  };

  const moveModule = (fromIndex: number, toIndex: number) => {
    const newModules = [...outline.modules];
    const [moved] = newModules.splice(fromIndex, 1);
    newModules.splice(toIndex, 0, moved);
    const updatedModules = newModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));
    setOutline((prev) => ({ ...prev, modules: updatedModules }));
  };

  const deleteModule = (index: number) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules
        .filter((_, i) => i !== index)
        .map((module, i) => ({ ...module, order: i + 1 })),
    }));
  };

  const addModule = () => {
    const newModule: ModuleOutline = {
      title: `Module ${outline.modules.length + 1}`,
      description: "New module description",
      learningObjectives: ["Learning objective 1"],
      estimatedDuration: "30 minutes",
      order: outline.modules.length + 1,
      slides: [],
      questions: [],
    };
    setOutline((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const toggleModuleExpansion = (index: number) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const addSlideToModule = (moduleIndex: number) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              slides: [
                ...(module.slides || []),
                {
                  title: `Slide ${(module.slides?.length || 0) + 1}`,
                  content: "Slide content here...",
                  order: (module.slides?.length || 0) + 1,
                },
              ],
            }
          : module
      ),
    }));
  };

  const updateSlideInModule = (
    moduleIndex: number,
    slideIndex: number,
    updates: Partial<SlideOutline>
  ) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              slides: module.slides?.map((slide, j) =>
                j === slideIndex ? { ...slide, ...updates } : slide
              ),
            }
          : module
      ),
    }));
  };

  const removeSlideFromModule = (moduleIndex: number, slideIndex: number) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              slides: module.slides?.filter((_, j) => j !== slideIndex),
            }
          : module
      ),
    }));
  };

  const addQuestionToModule = (moduleIndex: number) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              questions: [
                ...(module.questions || []),
                {
                  title: `Question ${(module.questions?.length || 0) + 1}`,
                  content: "Question text here",
                  options: [
                    {
                      text: "Option A",
                      isCorrect: true,
                      explanation: "Correct answer explanation",
                    },
                    {
                      text: "Option B",
                      isCorrect: false,
                      explanation: "Why this is incorrect",
                    },
                    {
                      text: "Option C",
                      isCorrect: false,
                      explanation: "Why this is incorrect",
                    },
                    {
                      text: "Option D",
                      isCorrect: false,
                      explanation: "Why this is incorrect",
                    },
                  ],
                  order: (module.questions?.length || 0) + 1,
                },
              ],
            }
          : module
      ),
    }));
  };

  const updateQuestionInModule = (
    moduleIndex: number,
    questionIndex: number,
    updates: Partial<QuestionOutline>
  ) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              questions: module.questions?.map((question, j) =>
                j === questionIndex ? { ...question, ...updates } : question
              ),
            }
          : module
      ),
    }));
  };

  const removeQuestionFromModule = (
    moduleIndex: number,
    questionIndex: number
  ) => {
    setOutline((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              questions: module.questions?.filter(
                (_, j) => j !== questionIndex
              ),
            }
          : module
      ),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="card bg-base-100 border border-base-300 shadow-lg">
        <div className="card-body p-6">
          {isEditingCourse ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Course Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg transition-all duration-200"
                  value={outline.title}
                  onChange={(e) => updateOutline({ title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg transition-all duration-200 resize-none"
                  rows={3}
                  value={outline.description}
                  onChange={(e) =>
                    updateOutline({ description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary transition-all duration-200 appearance-none cursor-pointer"
                    value={outline.difficulty}
                    onChange={(e) =>
                      updateOutline({
                        difficulty: e.target.value as CourseOutline["difficulty"],
                      })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary transition-all duration-200"
                    value={outline.estimatedDuration}
                    onChange={(e) =>
                      updateOutline({ estimatedDuration: e.target.value })
                    }
                    placeholder="e.g., 4 hours"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary transition-all duration-200"
                    value={outline.language}
                    onChange={(e) =>
                      updateOutline({ language: e.target.value })
                    }
                    placeholder="e.g., en, es, fr"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-success btn-sm gap-1"
                  onClick={() => setIsEditingCourse(false)}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  className="btn btn-ghost btn-sm gap-1"
                  onClick={() => {
                    setOutline(initialOutline);
                    setIsEditingCourse(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{outline.title}</h2>
                <p className="text-base-content/60">{outline.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {outline.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    <Clock className="h-3 w-3" />
                    {outline.estimatedDuration}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    {outline.language.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-base-200 text-base-content/60 text-xs font-medium">
                    {outline.modules.length} module
                    {outline.modules.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm gap-1"
                onClick={() => setIsEditingCourse(true)}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Course Modules
          </h3>
          <button
            className="btn btn-primary btn-sm gap-1"
            onClick={addModule}
          >
            <Plus className="h-4 w-4" />
            Add Module
          </button>
        </div>

        {outline.modules.length === 0 && (
          <div className="card bg-base-100 border border-base-300 border-dashed">
            <div className="card-body items-center text-center py-12">
              <FileText className="h-10 w-10 text-base-content/20 mb-2" />
              <p className="text-base-content/40">
                No modules yet. Click &quot;Add Module&quot; to get started.
              </p>
            </div>
          </div>
        )}

        {outline.modules.map((module, index) => (
          <div
            key={index}
            className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {editingModule === index ? (
              <div className="card-body p-5">
                <ModuleEditor
                  module={module}
                  onSave={(updates) => {
                    updateModule(index, updates);
                    setEditingModule(null);
                  }}
                  onCancel={() => setEditingModule(null)}
                />
              </div>
            ) : (
              <>
                {/* Module Header Row */}
                <div
                  className="card-body p-4 cursor-pointer select-none"
                  onClick={() => toggleModuleExpansion(index)}
                >
                  <div className="flex items-center gap-3">
                    {/* Order Badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                      {module.order}
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0 text-base-content/40">
                      {expandedModules.has(index) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {module.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-base-content/50">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.estimatedDuration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {module.slides?.length || 0} slides
                        </span>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" />
                          {module.questions?.length || 0} questions
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          moveModule(index, Math.max(0, index - 1))
                        }
                        disabled={index === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          moveModule(
                            index,
                            Math.min(outline.modules.length - 1, index + 1)
                          )
                        }
                        disabled={index === outline.modules.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setPreviewModule(index)}
                        title="Preview"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setEditingModule(index)}
                        title="Edit"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => deleteModule(index)}
                        disabled={outline.modules.length <= 1}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Learning Objectives Summary */}
                  {!expandedModules.has(index) &&
                    module.learningObjectives.length > 0 && (
                      <p className="text-xs text-base-content/40 ml-16 mt-1 line-clamp-1">
                        {module.learningObjectives[0]}
                        {module.learningObjectives.length > 1 &&
                          ` +${module.learningObjectives.length - 1} more`}
                      </p>
                    )}
                </div>

                {/* Expanded Content */}
                {expandedModules.has(index) && (
                  <div className="border-t border-base-200 px-5 py-4 space-y-5">
                    {/* Description */}
                    <div>
                      <p className="text-sm text-base-content/70">
                        {module.description}
                      </p>
                    </div>

                    {/* Learning Objectives */}
                    {module.learningObjectives.length > 0 && (
                      <div>
                        <h5 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-2">
                          <Target className="h-3 w-3" />
                          Learning Objectives
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {module.learningObjectives.map((obj, oi) => (
                            <span
                              key={oi}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-xs"
                            >
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Slides */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                          <FileText className="h-3 w-3" />
                          Slides ({module.slides?.length || 0})
                        </h5>
                        <button
                          className="btn btn-primary btn-xs gap-1"
                          onClick={() => addSlideToModule(index)}
                        >
                          <Plus className="h-3 w-3" />
                          Add Slide
                        </button>
                      </div>
                      <div className="space-y-2">
                        {module.slides?.map((slide, si) => (
                          <div
                            key={si}
                            className="flex items-start gap-2 p-3 rounded-xl bg-base-50 border border-base-200 group"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded bg-base-200 text-base-content/50 text-xs flex items-center justify-center font-medium">
                              {si + 1}
                            </span>
                            <div className="flex-1 space-y-1.5">
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 rounded-lg border border-base-200 bg-base-100 text-sm outline-none focus:border-primary transition-colors"
                                value={slide.title}
                                onChange={(e) =>
                                  updateSlideInModule(index, si, {
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Slide title"
                              />
                              <textarea
                                className="w-full px-3 py-1.5 rounded-lg border border-base-200 bg-base-100 text-xs outline-none focus:border-primary transition-colors resize-none"
                                rows={2}
                                value={slide.content}
                                onChange={(e) =>
                                  updateSlideInModule(index, si, {
                                    content: e.target.value,
                                  })
                                }
                                placeholder="Slide content"
                              />
                            </div>
                            <button
                              className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity text-error"
                              onClick={() => removeSlideFromModule(index, si)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {(!module.slides || module.slides.length === 0) && (
                          <p className="text-xs text-base-content/30 italic py-2">
                            No slides yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Questions */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                          <HelpCircle className="h-3 w-3" />
                          Questions ({module.questions?.length || 0})
                        </h5>
                        <button
                          className="btn btn-primary btn-xs gap-1"
                          onClick={() => addQuestionToModule(index)}
                        >
                          <Plus className="h-3 w-3" />
                          Add Question
                        </button>
                      </div>
                      <div className="space-y-2">
                        {module.questions?.map((question, qi) => (
                          <div
                            key={qi}
                            className="p-3 rounded-xl bg-base-50 border border-base-200 group"
                          >
                            <div className="flex items-start gap-2">
                              <span className="flex-shrink-0 w-6 h-6 rounded bg-base-200 text-base-content/50 text-xs flex items-center justify-center font-medium">
                                {qi + 1}
                              </span>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  className="w-full px-3 py-1.5 rounded-lg border border-base-200 bg-base-100 text-sm outline-none focus:border-primary transition-colors"
                                  value={question.title}
                                  onChange={(e) =>
                                    updateQuestionInModule(index, qi, {
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Question title"
                                />
                                <textarea
                                  className="w-full px-3 py-1.5 rounded-lg border border-base-200 bg-base-100 text-xs outline-none focus:border-primary transition-colors resize-none"
                                  rows={2}
                                  value={question.content}
                                  onChange={(e) =>
                                    updateQuestionInModule(index, qi, {
                                      content: e.target.value,
                                    })
                                  }
                                  placeholder="Question text"
                                />
                                <div className="space-y-1">
                                  {question.options.map((option, oi) => (
                                    <div
                                      key={oi}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="radio"
                                        name={`correct-${index}-${qi}`}
                                        checked={option.isCorrect}
                                        onChange={() => {
                                          const newOptions =
                                            question.options.map(
                                              (opt, idx) => ({
                                                ...opt,
                                                isCorrect: idx === oi,
                                              })
                                            );
                                          updateQuestionInModule(index, qi, {
                                            options: newOptions,
                                          });
                                        }}
                                        className="radio radio-primary radio-xs"
                                      />
                                      <span className="flex-shrink-0 text-xs text-base-content/40 w-5">
                                        {String.fromCharCode(65 + oi)}
                                      </span>
                                      <input
                                        type="text"
                                        className="flex-1 px-2.5 py-1 rounded-lg border border-base-200 bg-base-100 text-xs outline-none focus:border-primary transition-colors"
                                        value={option.text}
                                        onChange={(e) => {
                                          const newOptions = [
                                            ...question.options,
                                          ];
                                          newOptions[oi] = {
                                            ...option,
                                            text: e.target.value,
                                          };
                                          updateQuestionInModule(index, qi, {
                                            options: newOptions,
                                          });
                                        }}
                                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity text-error"
                                onClick={() =>
                                  removeQuestionFromModule(index, qi)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!module.questions ||
                          module.questions.length === 0) && (
                          <p className="text-xs text-base-content/30 italic py-2">
                            No questions yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setOutline(initialOutline)}
        >
          Reset to Original
        </button>
        <button
          className="btn btn-primary gap-2"
          onClick={onProceed}
          disabled={outline.modules.length === 0}
        >
          <Sparkles className="h-4 w-4" />
          Generate Full Course
        </button>
      </div>

      {/* Preview Modal */}
      {previewModule !== null && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl max-h-[85vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Module Preview
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPreviewModule(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const m = outline.modules[previewModule];
              if (!m) return null;
              return (
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <h4 className="text-xl font-bold mb-1">{m.title}</h4>
                    <p className="text-sm text-base-content/60 mb-3">
                      {m.description}
                    </p>
                    <div className="flex gap-2">
                      <span className="badge badge-primary badge-sm">
                        Module {m.order}
                      </span>
                      <span className="badge badge-secondary badge-sm">
                        {m.estimatedDuration}
                      </span>
                    </div>
                  </div>

                  {m.learningObjectives.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-primary" />
                        Learning Objectives
                      </h5>
                      <ul className="space-y-1">
                        {m.learningObjectives.map((obj, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="text-primary mt-0.5">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.slides && m.slides.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        Slides ({m.slides.length})
                      </h5>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {m.slides.map((slide, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-base-200/50 border border-base-200"
                          >
                            <h6 className="font-medium text-sm mb-2">
                              {slide.title || `Slide ${idx + 1}`}
                            </h6>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                  h1: (props) => (
                                    <h1
                                      className="text-lg font-bold my-2"
                                      {...props}
                                    />
                                  ),
                                  h2: (props) => (
                                    <h2
                                      className="text-base font-bold my-2"
                                      {...props}
                                    />
                                  ),
                                  p: (props) => (
                                    <p className="my-1 text-sm" {...props} />
                                  ),
                                  ul: (props) => (
                                    <ul
                                      className="my-1 ml-4 list-disc text-sm"
                                      {...props}
                                    />
                                  ),
                                  code: (props) => (
                                    <code
                                      className="bg-base-300 px-1 py-0.5 rounded text-xs"
                                      {...props}
                                    />
                                  ),
                                  pre: (props) => (
                                    <pre
                                      className="bg-base-300 p-2 rounded overflow-x-auto my-1 text-xs"
                                      {...props}
                                    />
                                  ),
                                }}
                              >
                                {slide.content || "*No content yet*"}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.questions && m.questions.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        Questions ({m.questions.length})
                      </h5>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {m.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-base-200/50 border border-base-200"
                          >
                            <h6 className="font-medium text-sm mb-1">
                              {q.title || `Question ${idx + 1}`}
                            </h6>
                            <p className="text-sm mb-2">{q.content}</p>
                            <div className="space-y-1.5">
                              {q.options.map((opt, oi) => (
                                <div
                                  key={oi}
                                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                                    opt.isCorrect
                                      ? "bg-success/10 text-success font-medium"
                                      : "text-base-content/60"
                                  }`}
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                                      opt.isCorrect
                                        ? "border-success bg-success"
                                        : "border-base-content/30"
                                    }`}
                                  >
                                    {opt.isCorrect && (
                                      <div className="w-full h-full rounded-full scale-50 bg-white" />
                                    )}
                                  </div>
                                  {opt.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="modal-action">
              <button
                className="btn btn-sm"
                onClick={() => setPreviewModule(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ModuleEditorProps {
  module: ModuleOutline;
  onSave: (updates: Partial<ModuleOutline>) => void;
  onCancel: () => void;
}

function ModuleEditor({ module, onSave, onCancel }: ModuleEditorProps) {
  const [editedModule, setEditedModule] = useState<ModuleOutline>({
    ...module,
    slides: module.slides || [],
    questions: module.questions || [],
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-primary" />
            Module Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg transition-all duration-200"
            value={editedModule.title}
            onChange={(e) =>
              setEditedModule((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-primary" />
            Duration
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg transition-all duration-200"
            value={editedModule.estimatedDuration}
            onChange={(e) =>
              setEditedModule((prev) => ({
                ...prev,
                estimatedDuration: e.target.value,
              }))
            }
            placeholder="e.g., 30 minutes"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          Description
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border-2 border-base-300 bg-base-100 outline-none focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg transition-all duration-200 resize-none"
          rows={2}
          value={editedModule.description}
          onChange={(e) =>
            setEditedModule((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-primary" />
          Learning Objectives
        </label>
        <div className="space-y-2">
          {editedModule.learningObjectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-sm outline-none focus-within:border-primary focus-within:shadow-primary/10 focus-within:shadow-lg transition-all duration-200"
                value={objective}
                onChange={(e) => {
                  const newObjectives = [
                    ...editedModule.learningObjectives,
                  ];
                  newObjectives[index] = e.target.value;
                  setEditedModule((prev) => ({
                    ...prev,
                    learningObjectives: newObjectives,
                  }));
                }}
                placeholder={`Learning objective ${index + 1}`}
              />
              <button
                className="btn btn-ghost btn-xs text-error"
                onClick={() => {
                  setEditedModule((prev) => ({
                    ...prev,
                    learningObjectives:
                      prev.learningObjectives.filter((_, i) => i !== index),
                  }));
                }}
                disabled={editedModule.learningObjectives.length <= 1}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline btn-sm gap-1"
            onClick={() => {
              setEditedModule((prev) => ({
                ...prev,
                learningObjectives: [
                  ...prev.learningObjectives,
                  `Learning objective ${prev.learningObjectives.length + 1}`,
                ],
              }));
            }}
          >
            <Plus className="h-3 w-3" />
            Add Objective
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          className="btn btn-success btn-sm gap-1"
          onClick={() => onSave(editedModule)}
        >
          <Save className="h-4 w-4" />
          Save Module
        </button>
        <button className="btn btn-ghost btn-sm gap-1" onClick={onCancel}>
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
