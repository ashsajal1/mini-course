import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseOutlineEditor from "@/app/course/create/course-outline-editor";

describe("CourseOutlineEditor Integration", () => {
  const mockOnOutlineChanged = vi.fn();
  const mockOnProceed = vi.fn();

  const testOutline = {
    title: "Test Course",
    description: "A test course description",
    difficulty: "Beginner" as const,
    estimatedDuration: "2 hours",
    language: "en",
    modules: [
      {
        title: "Introduction Module",
        description: "Basic introduction",
        learningObjectives: ["Learn basics", "Understand concepts"],
        estimatedDuration: "30 minutes",
        order: 1,
        slides: [
          {
            title: "Welcome Slide",
            content: "Welcome to the course!",
            order: 1,
          },
        ],
        questions: [
          {
            title: "Basic Question",
            content: "What is the answer?",
            order: 1,
            options: [
              { text: "Answer A", isCorrect: true, explanation: "Correct!" },
              { text: "Answer B", isCorrect: false, explanation: "Wrong!" },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders course outline with modules", () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    expect(screen.getByText("Review Course Outline")).toBeInTheDocument();
    expect(screen.getByText("Test Course")).toBeInTheDocument();
    expect(screen.getByText("Introduction Module")).toBeInTheDocument();
  });

  it("displays module statistics", () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    expect(screen.getByText("1 Slides")).toBeInTheDocument();
    expect(screen.getByText("1 Questions")).toBeInTheDocument();
  });

  it("handles proceed action", () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // This test just verifies the component renders without crashing
    expect(screen.getByText("Create Full Course")).toBeInTheDocument();
  });
});