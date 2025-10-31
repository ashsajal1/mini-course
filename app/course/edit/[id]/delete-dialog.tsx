"use client";

import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="bg-error/10 p-3 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-base-content/70 mb-6">{description}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-error gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}