import { describe, it, expect } from "vitest";
import { estimateCourseComplexity } from "@/lib/course-ai-service";

describe("Course AI Service", () => {
  describe("URL Validation", () => {
    // Test URL validation by testing the internal logic
    const isValidUrl = (url: string): boolean => {
      try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
      } catch {
        return false;
      }
    };

    it("accepts any valid HTTP/HTTPS URL", () => {
      const testUrls = [
        "https://example.com",
        "http://test.com",
        "https://docs.google.com/document",
        "https://github.com/user/repo",
        "https://medium.com/article",
        "https://notion.so/page",
        "https://developer.mozilla.org/docs",
        "https://stackoverflow.com/question",
        "https://wikipedia.org/wiki",
        "https://coursera.org/course",
        "https://udemy.com/course",
        "https://edx.org/course",
        "https://any-website.com/content",
        "https://sub.domain.co.uk/path",
      ];

      testUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(true);
      });
    });

    it("rejects invalid URLs", () => {
      const invalidUrls = [
        "not-a-url",
        "ftp://example.com",
        "file:///path/to/file",
        "javascript:alert('xss')",
        "",
        "   ",
      ];

      invalidUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(false);
      });
    });
  });

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

    it("estimates complexity for intermediate course", async () => {
      const outline = {
        title: "Intermediate Course",
        description: "An intermediate course",
        difficulty: "Intermediate" as const,
        estimatedDuration: "4 hours",
        language: "en",
        modules: [
          { title: "Module 1", description: "Desc 1", learningObjectives: ["Obj 1"], estimatedDuration: "1 hour", order: 1 },
        ],
      };

      const result = await estimateCourseComplexity(outline);

      expect(result.totalSlides).toBe(2); // 1 module * 2 slides per module
      expect(result.totalQuestions).toBe(2); // 1 module * 2 questions per module
    });

    it("estimates complexity for advanced course", async () => {
      const outline = {
        title: "Advanced Course",
        description: "An advanced course",
        difficulty: "Advanced" as const,
        estimatedDuration: "6 hours",
        language: "en",
        modules: [
          { title: "Module 1", description: "Desc 1", learningObjectives: ["Obj 1"], estimatedDuration: "2 hours", order: 1 },
        ],
      };

      const result = await estimateCourseComplexity(outline);

      expect(result.totalSlides).toBe(3); // 1 module * 3 slides per module
      expect(result.totalQuestions).toBe(2); // 1 module * 2 questions per module
    });

    it("estimates longer generation time for larger courses", async () => {
      const outline = {
        title: "Large Course",
        description: "A large course",
        difficulty: "Advanced" as const,
        estimatedDuration: "10 hours",
        language: "en",
        modules: Array.from({ length: 10 }, (_, i) => ({
          title: `Module ${i + 1}`,
          description: `Description ${i + 1}`,
          learningObjectives: ["Objective 1"],
          estimatedDuration: "1 hour",
          order: i + 1,
        })),
      };

      const result = await estimateCourseComplexity(outline);

      expect(result.totalSlides).toBe(30); // 10 modules * 3 slides per module
      expect(result.totalQuestions).toBe(20); // 10 modules * 2 questions per module
      expect(result.estimatedGenerationTime).toContain("hours");
    });
  });
});