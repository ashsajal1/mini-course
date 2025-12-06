"use client";

import { updateModule } from "@/app/course/edit/[id]/actions";
import { useRouter } from "next/navigation";
import ModuleDialog from "./module-dialog";
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
  const router = useRouter();

  const handleUpdate = async (title: string) => {
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
  };

  return (
    <ModuleDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Module"
      initialValue={initialTitle}
      submitLabel="Save Changes"
      onSubmit={handleUpdate}
    />
  );
}
