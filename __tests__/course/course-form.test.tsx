import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import CourseForm from "@/app/course/create/course-form";
import { createCourse } from "@/app/course/create/actions";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock the createCourse action
vi.mock("@/app/course/create/actions", () => ({
  createCourse: vi.fn(),
}));

describe("CourseForm Component", () => {
  const mockPush = vi.fn();
  const mockRouter = { push: mockPush, back: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter as any);
  });

  it("renders all form fields", () => {
    render(<CourseForm />);

    expect(screen.getByLabelText(/course name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/course description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difficulty level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/course language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create course/i })).toBeInTheDocument();
  });

  it("has correct default values", () => {
    render(<CourseForm />);

    const difficultySelect = screen.getByLabelText(/difficulty level/i) as HTMLSelectElement;
    const langSelect = screen.getByLabelText(/course language/i) as HTMLSelectElement;
    
    expect(difficultySelect.value).toBe("Beginner");
    expect(langSelect.value).toBe("en");
  });

  it("shows validation errors for required fields", async () => {
    render(<CourseForm />);

    const submitButton = screen.getByRole("button", { name: /create course/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/course name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const mockCourse = {
      id: "course-123",
      name: "Test Course",
      description: "This is a valid course description",
      difficulty: "Beginner",
      lang: "en",
      thumbnail_url: "https://example.com/image.jpg",
      creator: "test-user-id",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    vi.mocked(createCourse).mockResolvedValue({
      success: true,
      course: mockCourse,
    });

    render(<CourseForm />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/course name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/course description/i), {
      target: { value: "This is a valid course description" },
    });
    fireEvent.change(screen.getByLabelText(/thumbnail url/i), {
      target: { value: "https://example.com/image.jpg" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create course/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createCourse).toHaveBeenCalledWith(expect.any(FormData));
      expect(mockPush).toHaveBeenCalledWith("/course/edit/course-123");
    });
  });

  it("displays server error when creation fails", async () => {
    vi.mocked(createCourse).mockResolvedValue({
      success: false,
      error: "Failed to create course",
    });

    render(<CourseForm />);

    // Fill in minimal valid data
    fireEvent.change(screen.getByLabelText(/course name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/course description/i), {
      target: { value: "This is a valid course description" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create course/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to create course")).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    vi.mocked(createCourse).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<CourseForm />);

    // Fill in minimal valid data
    fireEvent.change(screen.getByLabelText(/course name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/course description/i), {
      target: { value: "This is a valid course description" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create course/i });
    fireEvent.click(submitButton);

    // Check loading state with act wrapper
    await waitFor(() => {
      expect(screen.getByText("Creating...")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();
  });

  it("navigates back when cancel is clicked", () => {
    render(<CourseForm />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("validates language field requirements", async () => {
    render(<CourseForm />);

    // Fill in form with valid data
    fireEvent.change(screen.getByLabelText(/course name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/course description/i), {
      target: { value: "This is a valid course description" },
    });

    // Submit form - should pass with default language
    const submitButton = screen.getByRole("button", { name: /create course/i });
    fireEvent.click(submitButton);

    // Should not show language errors since it has default value
    await waitFor(() => {
      expect(screen.queryByText(/language code must be at least/i)).not.toBeInTheDocument();
    });
  });

  it("allows empty thumbnail URL", async () => {
    const mockCourse = {
      id: "course-123",
      name: "Test Course",
      description: "This is a valid course description",
      difficulty: "Beginner",
      lang: "en",
      thumbnail_url: "",
      creator: "test-user-id",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    vi.mocked(createCourse).mockResolvedValue({
      success: true,
      course: mockCourse,
    });

    render(<CourseForm />);

    // Fill in form without thumbnail
    fireEvent.change(screen.getByLabelText(/course name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/course description/i), {
      target: { value: "This is a valid course description" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create course/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createCourse).toHaveBeenCalled();
    });
  });
});