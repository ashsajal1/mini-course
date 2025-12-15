import Slide from "./slide";
import Question from "./question";
import { ContentWithRelations } from "@/app/course/learn/[courseId]/[moduleId]/page";

export default function ModuleContent({
  content,
  isCreator,
  courseId,
  onComplete,
}: {
  content: ContentWithRelations;
  isCreator: boolean;
  courseId: string;
  onComplete?: () => void;
}) {
  if (content.type === "SLIDE") {
    return (
      <Slide slide={content.slide!} isCreator={isCreator} courseId={courseId} />
    );
  }

  return (
    <Question
      question={content.question!}
      isCreator={isCreator}
      courseId={courseId}
      onComplete={onComplete}
    />
  );
}
