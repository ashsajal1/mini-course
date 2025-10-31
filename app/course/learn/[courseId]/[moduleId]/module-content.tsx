import Slide from "./slide";
import Question from "./question";
import { ContentWithRelations } from "./page";

export default function ModuleContent({
  content,
}: {
  content: ContentWithRelations;
}) {
  if (content.type === "SLIDE") {
    return <Slide slide={content.slide!} />;
  }

  return <Question question={content.question!} />;
}
