"use client";

import { useState, useEffect } from "react";
import { CourseOutline, ModuleOutline, SlideOutline, QuestionOutline } from "@/lib/course-ai-service";
import { ArrowUp, ArrowDown, Trash2, Plus, Edit3, Save, X } from "lucide-react";

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
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  useEffect(() => {
    onOutlineChanged(outline);
  }, [outline, onOutlineChanged]);

  const updateOutline = (updates: Partial<CourseOutline>) => {
    setOutline(prev => ({ ...prev, ...updates }));
  };

  const updateModule = (index: number, updates: Partial<ModuleOutline>) => {
    setOutline(prev => ({
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

    // Update order numbers
    const updatedModules = newModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));

    setOutline(prev => ({ ...prev, modules: updatedModules }));
  };

  const deleteModule = (index: number) => {
    setOutline(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index).map((module, i) => ({
        ...module,
        order: i + 1,
      })),
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

    setOutline(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const toggleModuleExpansion = (index: number) => {
    setExpandedModules(prev => {
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
    setOutline(prev => ({
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

  const updateSlideInModule = (moduleIndex: number, slideIndex: number, updates: Partial<SlideOutline>) => {
    setOutline(prev => ({
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
    setOutline(prev => ({
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
    setOutline(prev => ({
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
                    { text: "Option A", isCorrect: true, explanation: "Correct answer explanation" },
                    { text: "Option B", isCorrect: false, explanation: "Why this is incorrect" },
                    { text: "Option C", isCorrect: false, explanation: "Why this is incorrect" },
                    { text: "Option D", isCorrect: false, explanation: "Why this is incorrect" },
                  ],
                  order: (module.questions?.length || 0) + 1,
                },
              ],
            }
          : module
      ),
    }));
  };

  const updateQuestionInModule = (moduleIndex: number, questionIndex: number, updates: Partial<QuestionOutline>) => {
    setOutline(prev => ({
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

  const removeQuestionFromModule = (moduleIndex: number, questionIndex: number) => {
    setOutline(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              questions: module.questions?.filter((_, j) => j !== questionIndex),
            }
          : module
      ),
    }));
  };



  return (
    <div className="space-y-6">
      {/* Course Header Editor */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl">Review Course Outline</h2>
            <button
              className="btn btn-primary"
              onClick={onProceed}
            >
              Create Full Course
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {isEditingCourse ? (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Course Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={outline.title}
                  onChange={(e) => updateOutline({ title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  value={outline.description}
                  onChange={(e) => updateOutline({ description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={outline.difficulty}
                    onChange={(e) => updateOutline({ difficulty: e.target.value as CourseOutline['difficulty'] })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Duration</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={outline.estimatedDuration}
                    onChange={(e) => updateOutline({ estimatedDuration: e.target.value })}
                    placeholder="e.g., 4 hours"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Language</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={outline.language}
                    onChange={(e) => updateOutline({ language: e.target.value })}
                    placeholder="e.g., en, es, fr"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setIsEditingCourse(false)}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  className="btn btn-ghost btn-sm"
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
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{outline.title}</h3>
                <p className="text-base-content/80 mt-2">{outline.description}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="badge badge-primary">{outline.difficulty}</span>
                  <span className="badge badge-secondary">{outline.estimatedDuration}</span>
                  <span className="badge badge-accent">{outline.language.toUpperCase()}</span>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setIsEditingCourse(true)}
              >
                <Edit3 className="h-4 w-4" />
                Edit Course Info
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modules Editor */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title text-xl">Course Modules</h3>
            <button className="btn btn-primary btn-sm" onClick={addModule}>
              <Plus className="h-4 w-4" />
              Add Module
            </button>
          </div>

          <div className="space-y-4">
            {outline.modules.map((module, index) => (
              <div key={index} className="card card-compact bg-base-200">
                <div className="card-body">
                  {editingModule === index ? (
                    <ModuleEditor
                      module={module}
                      onSave={(updates) => {
                        updateModule(index, updates);
                        setEditingModule(null);
                      }}
                      onCancel={() => setEditingModule(null)}
                    />
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-primary">{module.order}</span>
                            <h4 className="card-title text-base">{module.title}</h4>
                            <span className="badge badge-outline">{module.estimatedDuration}</span>
                            <span className="badge badge-ghost gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {(module.slides?.length || 0)} Slides
                            </span>
                            <span className="badge badge-ghost gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {(module.questions?.length || 0)} Questions
                            </span>
                          </div>

                          <p className="text-sm text-base-content/70 mb-2">
                            {module.description}
                          </p>

                          {module.learningObjectives.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-base-content/60">Learning Objectives:</p>
                              <ul className="text-xs space-y-0.5">
                                {module.learningObjectives.map((objective, objIndex) => (
                                  <li key={objIndex} className="flex items-start gap-1">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{objective}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1 ml-4">
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => toggleModuleExpansion(index)}
                          >
                            {expandedModules.has(index) ? 'Collapse' : 'Expand'}
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => moveModule(index, Math.max(0, index - 1))}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => moveModule(index, Math.min(outline.modules.length - 1, index + 1))}
                            disabled={index === outline.modules.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => setEditingModule(index)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            className="btn btn-error btn-xs"
                            onClick={() => deleteModule(index)}
                            disabled={outline.modules.length <= 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedModules.has(index) && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                          {/* Slides Section */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">Slides</h5>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => addSlideToModule(index)}
                              >
                                <Plus className="h-3 w-3" />
                                Add Slide
                              </button>
                            </div>
                            <div className="space-y-2">
                              {module.slides?.map((slide, slideIndex) => (
                                <div key={slideIndex} className="card card-compact bg-base-100">
                                  <div className="card-body p-3">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <input
                                          type="text"
                                          className="input input-sm input-bordered w-full mb-2"
                                          value={slide.title}
                                          onChange={(e) => updateSlideInModule(index, slideIndex, { title: e.target.value })}
                                          placeholder="Slide title"
                                        />
                                        <textarea
                                          className="textarea textarea-sm textarea-bordered w-full"
                                          rows={2}
                                          value={slide.content}
                                          onChange={(e) => updateSlideInModule(index, slideIndex, { content: e.target.value })}
                                          placeholder="Slide content here"
                                        />
                                      </div>
                                      <button
                                        className="btn btn-ghost btn-xs ml-2"
                                        onClick={() => removeSlideFromModule(index, slideIndex)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {(!module.slides || module.slides.length === 0) && (
                                <p className="text-sm text-base-content/50 italic">No slides yet. Click &quot;Add Slide&quot; to get started.</p>
                              )}
                            </div>
                          </div>

                          {/* Questions Section */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">Questions</h5>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => addQuestionToModule(index)}
                              >
                                <Plus className="h-3 w-3" />
                                Add Question
                              </button>
                            </div>
                            <div className="space-y-2">
                              {module.questions?.map((question, questionIndex) => (
                                <div key={questionIndex} className="card card-compact bg-base-100">
                                  <div className="card-body p-3">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <input
                                          type="text"
                                          className="input input-sm input-bordered w-full mb-2"
                                          value={question.title}
                                          onChange={(e) => updateQuestionInModule(index, questionIndex, { title: e.target.value })}
                                          placeholder="Question title"
                                        />
                                        <textarea
                                          className="textarea textarea-sm textarea-bordered w-full mb-2"
                                          rows={2}
                                          value={question.content}
                                          onChange={(e) => updateQuestionInModule(index, questionIndex, { content: e.target.value })}
                                          placeholder="Question text"
                                        />
                                        <div className="space-y-1">
                                          {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex gap-2 items-center">
                                              <input
                                                type="radio"
                                                name={`correct-${index}-${questionIndex}`}
                                                checked={option.isCorrect}
                                                onChange={() => {
                                                  const newOptions = question.options.map((opt, idx) => ({
                                                    ...opt,
                                                    isCorrect: idx === optionIndex,
                                                  }));
                                                  updateQuestionInModule(index, questionIndex, { options: newOptions });
                                                }}
                                              />
                                              <input
                                                type="text"
                                                className="input input-xs input-bordered flex-1"
                                                value={option.text}
                                                onChange={(e) => {
                                                  const newOptions = [...question.options];
                                                  newOptions[optionIndex] = { ...option, text: e.target.value };
                                                  updateQuestionInModule(index, questionIndex, { options: newOptions });
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <button
                                        className="btn btn-ghost btn-xs ml-2"
                                        onClick={() => removeQuestionFromModule(index, questionIndex)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {(!module.questions || module.questions.length === 0) && (
                                <p className="text-sm text-base-content/50 italic">No questions yet. Click &quot;Add Question&quot; to get started.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {outline.modules.length === 0 && (
            <div className="text-center py-8 text-base-content/60">
              <p>No modules yet. Click &quot;Add Module&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          className="btn btn-ghost"
          onClick={() => setOutline(initialOutline)}
        >
          Reset to Original
        </button>
        <button
          className="btn btn-primary"
          onClick={onProceed}
          disabled={outline.modules.length === 0}
        >
          Generate Full Course
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
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

  const handleSave = () => {
    onSave(editedModule);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Module Title</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={editedModule.title}
            onChange={(e) => setEditedModule(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={editedModule.estimatedDuration}
            onChange={(e) => setEditedModule(prev => ({ ...prev, estimatedDuration: e.target.value }))}
            placeholder="e.g., 30 minutes"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          rows={2}
          value={editedModule.description}
          onChange={(e) => setEditedModule(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Learning Objectives</span>
        </label>
        <div className="space-y-2">
          {editedModule.learningObjectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...editedModule.learningObjectives];
                  newObjectives[index] = e.target.value;
                  setEditedModule(prev => ({ ...prev, learningObjectives: newObjectives }));
                }}
                placeholder={`Learning objective ${index + 1}`}
              />
              <button
                className="btn btn-error btn-sm"
                onClick={() => {
                  setEditedModule(prev => ({
                    ...prev,
                    learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
                  }));
                }}
                disabled={editedModule.learningObjectives.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setEditedModule(prev => ({
                ...prev,
                learningObjectives: [...prev.learningObjectives, `Learning objective ${prev.learningObjectives.length + 1}`],
              }));
            }}
          >
            <Plus className="h-4 w-4" />
            Add Objective
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-success btn-sm" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Module
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}