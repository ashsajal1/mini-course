import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourseOutlineEditor from "@/app/course/create/course-outline-editor";

describe("CourseOutlineEditor Integration", () => {
  const mockOnOutlineChanged = vi.fn();
  const mockOnProceed = vi.fn();
  const user = userEvent.setup();

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
            content: "What is this course about?",
            order: 1,
            options: [
              { text: "Learning", isCorrect: true, explanation: "Correct!" },
              { text: "Nothing", isCorrect: false, explanation: "Incorrect" },
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

  it("allows expanding and collapsing modules", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Initially collapsed
    expect(screen.queryByText("Slides")).not.toBeInTheDocument();

    // Find the expand button (it's the second button, after Edit Course Info)
    const buttons = screen.getAllByRole("button");
    const expandButton = buttons.find(button => button.textContent === "Expand");
    expect(expandButton).toBeInTheDocument();

    await user.click(expandButton!);

    // Should show expanded content
    expect(screen.getByText("Slides")).toBeInTheDocument();
    expect(screen.getByText("Questions")).toBeInTheDocument();
  });

  it("allows editing course information", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    const editButton = screen.getByText("Edit Course Info");
    await user.click(editButton);

    // Should show edit form
    expect(screen.getByDisplayValue("Test Course")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A test course description")).toBeInTheDocument();

    // Edit title
    const titleInput = screen.getByDisplayValue("Test Course");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Course Title");

    // Save changes
    const saveButton = screen.getByText("Save Changes");
    await user.click(saveButton);

    // Should call onOutlineChanged with updated outline
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Updated Course Title",
      })
    );
  });

  it("allows editing module information", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Find the edit button by looking for buttons with Edit3 icon
    const editButtons = screen.getAllByRole("button");
    const editModuleButton = editButtons.find(button =>
      button.innerHTML.includes('lucide-edit-3') ||
      button.querySelector('svg[class*="lucide-edit-3"]')
    );

    if (editModuleButton) {
      await user.click(editModuleButton);
    } else {
      // Fallback: click the edit button by position (3rd button in the group)
      const moduleButtons = screen.getAllByRole("button").filter(button =>
        button.closest('[class*="card-body"]')
      );
      const editBtn = moduleButtons.find(btn => btn.textContent?.trim() === '');
      if (editBtn) {
        await user.click(editBtn);
      }
    }

    // Should show module edit form
    expect(screen.getByDisplayValue("Introduction Module")).toBeInTheDocument();

    // Edit module title
    const titleInput = screen.getByDisplayValue("Introduction Module");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Module Title");

    // Save changes
    const saveButton = screen.getByText("Save Module");
    await user.click(saveButton);

    // Should call onOutlineChanged with updated module
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: expect.arrayContaining([
          expect.objectContaining({
            title: "Updated Module Title",
          }),
        ]),
      })
    );
  });

  it("allows adding new modules", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    const addModuleButton = screen.getByText("Add Module");
    await user.click(addModuleButton);

    // Should call onOutlineChanged with new module
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: expect.arrayContaining([
          expect.objectContaining({
            title: "Module 2",
            order: 2,
          }),
        ]),
      })
    );
  });

  it("allows adding slides to modules", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Expand module first
    const expandButton = screen.getByText("Expand");
    await user.click(expandButton);

    const addSlideButton = screen.getByText("Add Slide");
    await user.click(addSlideButton);

    // Should call onOutlineChanged with new slide
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: expect.arrayContaining([
          expect.objectContaining({
            slides: expect.arrayContaining([
              expect.objectContaining({
                title: "Slide 2",
                order: 2,
              }),
            ]),
          }),
        ]),
      })
    );
  });

  it("allows adding questions to modules", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Expand module first
    const expandButton = screen.getByText("Expand");
    await user.click(expandButton);

    const addQuestionButton = screen.getByText("Add Question");
    await user.click(addQuestionButton);

    // Should call onOutlineChanged with new question
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: expect.arrayContaining([
          expect.objectContaining({
            questions: expect.arrayContaining([
              expect.objectContaining({
                title: "Question 2",
                order: 2,
              }),
            ]),
          }),
        ]),
      })
    );
  });

  it("allows editing slide content", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Expand module first
    const expandButton = screen.getByText("Expand");
    await user.click(expandButton);

    // Edit slide title
    const titleInput = screen.getByDisplayValue("Welcome Slide");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Slide Title");

    // Trigger change event
    await user.tab();

    // Should call onOutlineChanged with updated slide
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: expect.arrayContaining([
          expect.objectContaining({
            slides: expect.arrayContaining([
              expect.objectContaining({
                title: "Updated Slide Title",
              }),
            ]),
          }),
        ]),
      })
    );
  });

  it("allows editing question content and options", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Expand module first
    const expandButton = screen.getByText("Expand");
    await user.click(expandButton);

    // Edit question title
    const titleInput = screen.getByDisplayValue("Basic Question");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Question Title");

    // Trigger change event
    await user.tab();

    // Should call onOutlineChanged with updated question
    expect(mockOnOutlineChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        modules: expect.arrayContaining([
          expect.objectContaining({
            questions: expect.arrayContaining([
              expect.objectContaining({
                title: "Updated Question Title",
              }),
            ]),
          }),
        ]),
      })
    );
  });

  it("handles proceed action", async () => {
    render(
      <CourseOutlineEditor
        initialOutline={testOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    const proceedButton = screen.getByText("Create Full Course");
    await user.click(proceedButton);

    expect(mockOnProceed).toHaveBeenCalled();
  });

  it("shows empty state when no modules exist", () => {
    const emptyOutline = {
      ...testOutline,
      modules: [],
    };

    render(
      <CourseOutlineEditor
        initialOutline={emptyOutline}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    expect(screen.getByText("No modules yet. Click \"Add Module\" to get started.")).toBeInTheDocument();
  });

  it("shows empty state for slides and questions", async () => {
    const outlineWithoutContent = {
      ...testOutline,
      modules: [
        {
          ...testOutline.modules[0],
          slides: [],
          questions: [],
        },
      ],
    };

    render(
      <CourseOutlineEditor
        initialOutline={outlineWithoutContent}
        onOutlineChanged={mockOnOutlineChanged}
        onProceed={mockOnProceed}
      />
    );

    // Expand module
    const expandButton = screen.getByText("Expand");
    await user.click(expandButton);

    expect(screen.getByText("No slides yet. Click \"Add Slide\" to get started.")).toBeInTheDocument();
    expect(screen.getByText("No questions yet. Click \"Add Question\" to get started.")).toBeInTheDocument();
  });
});