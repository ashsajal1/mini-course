"use client";

import { useState, useTransition } from "react";
import { updateModule } from "@/app/course/edit/[id]/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  initialTitle: string;
}

export default function EditModuleDialog({
  isOpen,
  onClose,
  moduleId,
  initialTitle,
}: EditModuleDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        const response = await updateModule(moduleId, title);

        if (response.success) {
          toast.success("Module updated successfully");
          onClose();
          router.refresh();
        } else {
          toast.error("Failed to update module");
        }
      } catch (error) {
        console.error("Failed to update module:", error);
        toast.error("An error occurred");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Module</h3>
        <form onSubmit={handleUpdateModule}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Module Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
              className="input input-bordered w-full"
              autoFocus
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
