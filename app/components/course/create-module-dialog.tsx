"use client";

import { useState } from "react";
import { createModule } from "@/app/course/edit/[id]/actions";
import { useRouter } from "next/navigation";

interface CreateModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export default function CreateModuleDialog({
  isOpen,
  onClose,
  courseId,
}: CreateModuleDialogProps) {
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const router = useRouter();

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      const response = await createModule(courseId, newModuleTitle);

      if (response.success) {
        setNewModuleTitle("");
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  };

  if (!isOpen) return null;

  return (
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
                setNewModuleTitle("");
                onClose();
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
  );
}
