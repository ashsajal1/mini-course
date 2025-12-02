"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleEnrollment } from "./actions";
import { ArrowRight, Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onEnroll = () => {
    startTransition(async () => {
      const result = await handleEnrollment(courseId);
      if (result.success) {
        router.push(`/course/learn/${courseId}`);
      } else {
        // Handle error (maybe show a toast or alert)
        console.error(result.error);
        alert("Failed to enroll: " + result.error);
      }
    });
  };

  return (
    <button
      onClick={onEnroll}
      disabled={isPending}
      className="btn btn-primary gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          Enroll in Course
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
