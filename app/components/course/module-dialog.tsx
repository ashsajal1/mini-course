"use client";

import { useState, useTransition } from "react";
import { Loader2, Layers } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-card p-0 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100 border border overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border bg-base-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-6">
              <label className="label px-0 pt-0">
                <span className="label-text font-medium text-muted-foreground">
                  Module Title
                </span>
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., Introduction to React"
                className="input input-bordered w-full focus:input-primary focus:ring-2 focus:ring-primary/20 transition-all bg-muted/50 focus:bg-card"
                autoFocus
                disabled={isPending}
              />
              <label className="label px-0 pb-0">
                <span className="label-text-alt text-foreground/50">
                  Give your module a clear, descriptive name.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost hover:bg-muted font-medium"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary min-w-[120px] shadow-lg shadow-primary/20"
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
    </div>
  );
}
