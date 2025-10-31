"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Module } from "@/app/generated/prisma/client";
import { createModule } from "./actions";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import SlideForm with no SSR
const SlideForm = dynamic(
  () => import('./slide-form'),
  { ssr: false }
);

interface ModulesProps {
  modules: Module[];
  courseId: string;
}

export default function Modules({ modules, courseId }: ModulesProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const router = useRouter();

  const handleAddSlide = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setShowSlideForm(true);
  };

  const handleSlideFormSuccess = () => {
    setShowSlideForm(false);
    router.refresh();
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
                  <p className="text-base-content/70 mb-4">
                    Module content will be displayed here
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleAddSlide(module.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slide
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Quiz
                    </button>
                    <div className="divider divider-horizontal my-0">OR</div>
                    <button className="btn btn-ghost btn-sm text-error">
                      Delete Module
                    </button>
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
          onClose={() => setShowSlideForm(false)}
          onSuccess={handleSlideFormSuccess}
        />
      )}
    </div>
  );
}
