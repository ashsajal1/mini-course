import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CourseCard from "@/app/components/course/course-card";
import * as enrollmentService from "@/lib/enrollment-service";

// Mock next/image with a simple img element
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("@/app/components/course/save-course-button", () => ({
  default: () => <button data-testid="save-course-button">Save</button>,
}));

// Mock the enrollment service
vi.mock("@/lib/enrollment-service", () => ({
  getCourseEnrollmentCount: vi.fn(),
}));

describe("CourseCard Component", () => {
  const mockCourse = {
    id: "course-123",
    title: "Test Course",
    description: "This is a test course description",
    difficulty: "Beginner",
    thumbnail_url: "/test-image.jpg",
    moduleCount: 5,
  };

  it("renders course details correctly", () => {
    // Setup return value for the async call
    vi.mocked(enrollmentService.getCourseEnrollmentCount).mockResolvedValue(42);

    render(<CourseCard {...mockCourse} />);

    // Check static content
    expect(screen.getByText("Test Course")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test course description")
    ).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
    expect(screen.getByText("5 modules")).toBeInTheDocument();

    // Check image
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test Course");

    // Check link
    const link = screen.getByRole("link", { name: /view course/i });
    expect(link).toHaveAttribute("href", "course/course-123");
  });

  it("fetches and displays enrollment count", async () => {
    vi.mocked(enrollmentService.getCourseEnrollmentCount).mockResolvedValue(
      100
    );

    render(<CourseCard {...mockCourse} />);

    // Initially might be 0 or empty, wait for update
    await waitFor(() => {
      expect(screen.getByText("100 students")).toBeInTheDocument();
    });

    expect(enrollmentService.getCourseEnrollmentCount).toHaveBeenCalledWith(
      "course-123"
    );
  });

  it("renders with default image if thumbnail is missing", () => {
    vi.mocked(enrollmentService.getCourseEnrollmentCount).mockResolvedValue(0);
    const courseWithoutImage = { ...mockCourse, thumbnail_url: "" };

    render(<CourseCard {...courseWithoutImage} />);

    const image = screen.getByRole("img");
    // In the component: src={thumbnail_url || "/next.svg"}
    expect(image).toHaveAttribute("src", "/next.svg");
  });
});
