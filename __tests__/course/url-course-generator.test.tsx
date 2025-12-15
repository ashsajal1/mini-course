import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UrlCourseGenerator from "@/app/course/create/url-course-generator";
import { generateCourseOutline, estimateCourseComplexity } from "@/lib/course-ai-service";

// Mock dependencies
vi.mock("@/lib/course-ai-service", () => ({
  generateCourseOutline: vi.fn(),
  estimateCourseComplexity: vi.fn(),
}));

const mockGenerateCourseOutline = vi.mocked(generateCourseOutline);
const mockEstimateCourseComplexity = vi.mocked(estimateCourseComplexity);

describe("UrlCourseGenerator Integration", () => {
  const mockOnOutlineGenerated = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockGenerateCourseOutline.mockResolvedValue({
      success: true,
      outline: {
        title: "Test Course",
        description: "A comprehensive test course",
        difficulty: "Beginner" as const,
        estimatedDuration: "2 hours",
        language: "en",
        modules: [
          {
            title: "Introduction",
            description: "Getting started",
            learningObjectives: ["Understand basics"],
            estimatedDuration: "30 minutes",
            order: 1,
          },
          {
            title: "Advanced Topics",
            description: "Deep dive",
            learningObjectives: ["Master advanced concepts"],
            estimatedDuration: "1.5 hours",
            order: 2,
          },
        ],
      },
    });

    mockEstimateCourseComplexity.mockResolvedValue({
      totalSlides: 3,
      totalQuestions: 4,
      estimatedGenerationTime: "2 minutes",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the URL input form initially", () => {
    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    expect(screen.getByText("Generate Course from Document")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("https://example.com/article-or-document")).toBeInTheDocument();
    expect(screen.getByText("Generate Outline")).toBeInTheDocument();
  });

  it("shows supported content types", () => {
    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    expect(screen.getByText("Supported Content Types:")).toBeInTheDocument();
    expect(screen.getByText("Any Website")).toBeInTheDocument();
    expect(screen.getByText("Accepts any website URL containing educational content")).toBeInTheDocument();
  });

  it("validates URL input", async () => {
    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");
    const button = screen.getByText("Generate Outline");

    // Initially disabled for empty input
    expect(button).toBeDisabled();

    // Invalid URL
    await user.type(input, "not-a-url");
    expect(button).toBeDisabled();

    // Valid URL
    await user.clear(input);
    await user.type(input, "https://example.com");
    expect(button).not.toBeDisabled();

    // Non-HTTP URL
    await user.clear(input);
    await user.type(input, "ftp://example.com");
    expect(button).toBeDisabled();
  });

  it("handles successful course outline generation", async () => {
    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");
    const button = screen.getByText("Generate Outline");

    await user.type(input, "https://example.com/test-article");
    await user.click(button);

    // Should show loading state
    expect(screen.getByText("Generating...")).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText("Course Outline Generated!")).toBeInTheDocument();
    });

    // Should display course info
    expect(screen.getByText("Test Course")).toBeInTheDocument();
    expect(screen.getByText("A comprehensive test course")).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();

    // Should display module info
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Advanced Topics")).toBeInTheDocument();

    // Should show estimates
    expect(screen.getByText("Estimated Generation: 2 minutes • 3 slides • 4 questions")).toBeInTheDocument();

    // Should call onOutlineGenerated
    expect(mockOnOutlineGenerated).toHaveBeenCalledWith(expect.objectContaining({
      title: "Test Course",
      modules: expect.any(Array),
    }));
  });

  it("handles generation errors gracefully", async () => {
    mockGenerateCourseOutline.mockResolvedValue({
      success: false,
      error: "Failed to analyze the URL content",
    });

    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");
    const button = screen.getByText("Generate Outline");

    await user.type(input, "https://example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Failed to analyze the URL content")).toBeInTheDocument();
    });

    // Should not call onOutlineGenerated
    expect(mockOnOutlineGenerated).not.toHaveBeenCalled();
  });

  it("clears error when user starts typing", async () => {
    mockGenerateCourseOutline.mockResolvedValueOnce({
      success: false,
      error: "URL validation failed",
    });

    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");

    // Trigger error state
    await user.type(input, "invalid-url");
    const button = screen.getByText("Generate Outline");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("URL validation failed")).toBeInTheDocument();
    });

    // Start typing again
    await user.clear(input);
    await user.type(input, "https://example.com");

    // Error should be cleared
    expect(screen.queryByText("URL validation failed")).not.toBeInTheDocument();
  });

  it("handles API failures gracefully", async () => {
    mockGenerateCourseOutline.mockRejectedValue(new Error("Network error"));

    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");
    const button = screen.getByText("Generate Outline");

    await user.type(input, "https://example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred while generating the outline")).toBeInTheDocument();
    });
  });

  it("shows module learning objectives preview", async () => {
    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");
    const button = screen.getByText("Generate Outline");

    await user.type(input, "https://example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Course Outline Generated!")).toBeInTheDocument();
    });

    // Should show learning objectives preview
    expect(screen.getByText("Understand basics")).toBeInTheDocument();
    expect(screen.getByText("Master advanced concepts")).toBeInTheDocument();
  });

  it("displays module statistics correctly", async () => {
    render(<UrlCourseGenerator onOutlineGenerated={mockOnOutlineGenerated} />);

    const input = screen.getByPlaceholderText("https://example.com/article-or-document");
    const button = screen.getByText("Generate Outline");

    await user.type(input, "https://example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Course Outline Generated!")).toBeInTheDocument();
    });

    // Should show module count
    expect(screen.getByText("2")).toBeInTheDocument(); // 2 modules
  });
});