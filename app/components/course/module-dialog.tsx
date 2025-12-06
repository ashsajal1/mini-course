"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface ModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue?: string;
  submitLabel: string;
  onSubmit: (value: string) => Promise<void>;
}

export default function ModuleDialog({
  isOpen,
  onClose,
  title,
  initialValue = "",
  submitLabel,
  onSubmit,
}: ModuleDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    startTransition(async () => {
      await onSubmit(value);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all duration-200">
      <div className="bg-base-100 p-6 rounded-xl w-full max-w-md shadow-2xl transform transition-all scale-100">
        <h3 className="text-xl font-bold mb-6 text-base-content">{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-medium">Module Title</span>
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., Introduction to React"
              className="input input-bordered w-full focus:input-primary transition-all"
              autoFocus
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost hover:bg-base-200"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={isPending || !value.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
