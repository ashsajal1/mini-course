"use client";

import { createModule } from "@/app/course/edit/[id]/actions";
import { useRouter } from "next/navigation";
import ModuleDialog from "./module-dialog";
import { toast } from "sonner";

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
  const router = useRouter();

  const handleCreate = async (title: string) => {
    try {
      const response = await createModule(courseId, title);

      if (response.success) {
        toast.success("Module created successfully");
        onClose();
        router.refresh();
      } else {
        toast.error("Failed to create module");
      }
    } catch (error) {
      console.error("Failed to create module:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <ModuleDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Module"
      submitLabel="Create Module"
      onSubmit={handleCreate}
    />
  );
}
