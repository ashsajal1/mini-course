import { describe, it, expect } from "vitest";
import { estimateCourseComplexity } from "@/lib/course-ai-service";

describe("Course AI Service", () => {
  describe("estimateCourseComplexity", () => {
    it("estimates complexity for beginner course", async () => {
      const outline = {
        title: "Beginner Course",
        description: "A beginner course",
        difficulty: "Beginner" as const,
        estimatedDuration: "2 hours",
        language: "en",
        modules: [
          { title: "Module 1", description: "Desc 1", learningObjectives: ["Obj 1"], estimatedDuration: "30 min", order: 1 },
          { title: "Module 2", description: "Desc 2", learningObjectives: ["Obj 1", "Obj 2"], estimatedDuration: "30 min", order: 2 },
        ],
      };

      const result = await estimateCourseComplexity(outline);

      expect(result.totalSlides).toBe(3); // 2 modules * 1.5 slides per module
      expect(result.totalQuestions).toBe(4); // 2 modules * 2 questions per module
      expect(result.estimatedGenerationTime).toContain("minutes");
    });
  });
});