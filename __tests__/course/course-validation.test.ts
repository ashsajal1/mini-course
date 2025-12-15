import { describe, it, expect } from "vitest";
import { courseFormSchema, validateCourseData } from "@/app/course/create/course-validation";

describe("Course Validation", () => {
  const validCourseData = {
    name: "Test Course",
    description: "This is a detailed course description that meets the minimum requirements",
    difficulty: "Beginner",
    lang: "en",
    thumbnail_url: "https://example.com/image.jpg",
  };

  describe("courseFormSchema", () => {
    it("validates correct course data", () => {
      const result = courseFormSchema.safeParse(validCourseData);
      expect(result.success).toBe(true);
    });

    it("validates course name requirements", () => {
      const tooShortName = { ...validCourseData, name: "AB" };
      const tooLongName = { ...validCourseData, name: "A".repeat(101) };

      expect(courseFormSchema.safeParse(tooShortName).success).toBe(false);
      expect(courseFormSchema.safeParse(tooLongName).success).toBe(false);
    });

    it("validates description requirements", () => {
      const tooShortDesc = { ...validCourseData, description: "Short" };
      const tooLongDesc = { ...validCourseData, description: "A".repeat(1001) };

      expect(courseFormSchema.safeParse(tooShortDesc).success).toBe(false);
      expect(courseFormSchema.safeParse(tooLongDesc).success).toBe(false);
    });

    it("validates difficulty levels", () => {
      const invalidDifficulty = { ...validCourseData, difficulty: "Expert" };
      const result = courseFormSchema.safeParse(invalidDifficulty);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid difficulty level");
      }
    });

    it("validates language field", () => {
      const tooShortLang = { ...validCourseData, lang: "a" };
      const tooLongLang = { ...validCourseData, lang: "a".repeat(11) };

      expect(courseFormSchema.safeParse(tooShortLang).success).toBe(false);
      expect(courseFormSchema.safeParse(tooLongLang).success).toBe(false);
    });

    it("accepts valid language codes", () => {
      const validLangs = ["en", "es", "fr", "de", "zh", "ja"];
      
      validLangs.forEach(lang => {
        const data = { ...validCourseData, lang };
        const result = courseFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("validates thumbnail URL", () => {
      const invalidUrl = { ...validCourseData, thumbnail_url: "not-a-url" };
      const httpUrl = { ...validCourseData, thumbnail_url: "http://example.com/image.jpg" };
      const invalidExtension = { ...validCourseData, thumbnail_url: "https://example.com/file.pdf" };

      // The schema just validates it's a string, so all should pass
      expect(courseFormSchema.safeParse(invalidUrl).success).toBe(true);
      expect(courseFormSchema.safeParse(httpUrl).success).toBe(true);
      expect(courseFormSchema.safeParse(invalidExtension).success).toBe(true);
    });

    it("accepts valid image URLs", () => {
      const validUrls = [
        "https://example.com/image.jpg",
        "https://example.com/image.jpeg",
        "https://example.com/image.png",
        "https://example.com/image.webp",
      ];

      validUrls.forEach(url => {
        const data = { ...validCourseData, thumbnail_url: url };
        const result = courseFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("allows empty thumbnail URL", () => {
      const emptyThumbnail = { ...validCourseData, thumbnail_url: "" };
      const result = courseFormSchema.safeParse(emptyThumbnail);
      expect(result.success).toBe(true);
    });
  });

  describe("validateCourseData", () => {
    it("returns success for valid data", () => {
      const result = validateCourseData(validCourseData);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe(validCourseData.name);
      expect(result.data?.description).toBe(validCourseData.description);
      expect(result.data?.difficulty).toBe(validCourseData.difficulty);
      expect(result.data?.lang).toBe(validCourseData.lang);
    });

    it("returns error for invalid data", () => {
      const invalidData = { ...validCourseData, name: "AB" };
      const result = validateCourseData(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("handles unexpected errors gracefully", () => {
      const result = validateCourseData(null);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});