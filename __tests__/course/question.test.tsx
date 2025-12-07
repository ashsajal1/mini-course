import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Question from "@/app/components/course/question";
import { Prisma } from "@prisma/client";

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: {
    options: true;
    content_item: true;
  };
}>;

type Option = Prisma.OptionGetPayload<{
  select: {
    id: true;
    text: true;
    isCorrect: true;
    questionId: true;
    explanation: true;
    created_at: true;
    updated_at: true;
  };
}>;

const mockDate = new Date("2024-01-01T00:00:00.000Z");

describe("Question Component", () => {
  const mockOptions: Option[] = [
    {
      id: "opt1",
      text: "Option A",
      isCorrect: true,
      questionId: "q1",
      explanation: "General explanation for the question.",
      created_at: mockDate,
      updated_at: mockDate,
    },
    {
      id: "opt2",
      text: "Option B",
      isCorrect: false,
      questionId: "q1",
      explanation: "General explanation for the question.",
      created_at: mockDate,
      updated_at: mockDate,
    },
    {
      id: "opt3",
      text: "Option C",
      isCorrect: false,
      questionId: "q1",
      explanation: "General explanation for the question.",
      created_at: mockDate,
      updated_at: mockDate,
    },
  ];

  const mockQuestion: QuestionWithOptions = {
    id: "q1",
    title: "Test Question",
    content: "What is the correct answer?",
    module_id: "mod1",
    created_at: mockDate,
    updated_at: mockDate,
    deleted_at: null,
    content_item_id: "ci1",
    options: mockOptions,
    content_item: {
      id: "ci1",
      type: "QUESTION",
      order: 0,
      module_id: "mod1",
      created_at: mockDate,
      updated_at: mockDate,
    },
  };

  it("renders question and options correctly", () => {
    render(<Question question={mockQuestion} />);

    expect(screen.getByText("What is the correct answer?")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();

    // Submit button should be disabled initially
    const submitBtn = screen.getByRole("button", { name: /submit answer/i });
    expect(submitBtn).toBeDisabled();
  });

  it("allows selecting an option", () => {
    render(<Question question={mockQuestion} />);

    const optionA = screen.getByText("Option A");
    fireEvent.click(optionA);

    // Check if styled as selected (checking class might be brittle, but looking for visual feedback logic)
    // The component applies 'border-primary bg-primary/10' when selected
    // Better to check if the button is enabled now
    const submitBtn = screen.getByRole("button", { name: /submit answer/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("toggles selection when clicking the same option", () => {
    render(<Question question={mockQuestion} />);

    const optionA = screen.getByText("Option A");

    // Select
    fireEvent.click(optionA);
    const submitBtn = screen.getByRole("button", { name: /submit answer/i });
    expect(submitBtn).not.toBeDisabled();

    // Deselect
    fireEvent.click(optionA);
    expect(submitBtn).toBeDisabled(); // Should be disabled again if nothing is selected
  });

  it("shows correct feedback when submitting correct answer", () => {
    render(<Question question={mockQuestion} />);

    const optionA = screen.getByText("Option A"); // Correct option (now)
    fireEvent.click(optionA);

    const submitBtn = screen.getByRole("button", { name: /submit answer/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Correct! Well done!")).toBeInTheDocument();
    expect(screen.getByText("Explanation:")).toBeInTheDocument();
    expect(
      screen.getByText("General explanation for the question.")
    ).toBeInTheDocument();

    // Button changes to "Answer Submitted"
    expect(
      screen.getByRole("button", { name: /answer submitted/i })
    ).toBeDisabled();
  });

  it("shows incorrect feedback when submitting wrong answer", () => {
    render(<Question question={mockQuestion} />);

    const optionB = screen.getByText("Option B"); // Wrong option (now)
    fireEvent.click(optionB);

    const submitBtn = screen.getByRole("button", { name: /submit answer/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText("Incorrect. Please try again.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("General explanation for the question.")
    ).toBeInTheDocument();
  });
});
