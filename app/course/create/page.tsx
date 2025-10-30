import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/client";

async function createCourse(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const creator = formData.get("creator") as string;

  if (!name || !description || !difficulty || !thumbnail_url || !creator) {
    throw new Error("All fields are required");
  }

  await prisma.course.create({
    data: {
      name,
      description,
      difficulty,
      thumbnail_url,
      creator,
    },
  });

  redirect("/");
}

export default function CreateCoursePage() {

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="w-full max-w-4xl mx-auto card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-base-content/70 mb-6">Fill in the details below to create a new course</p>

          <form action={createCourse} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Creator */}
              <div className="form-control">
                <label className="label" htmlFor="creator">
                  <span className="label-text font-semibold">Creator Name</span>
                </label>
                <input
                  type="text"
                  id="creator"
                  name="creator"
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter your name"
                />
              </div>

              {/* Course Name */}
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text font-semibold">Course Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input input-bordered w-full  focus:ring-primary"
                  placeholder="e.g., Introduction to React"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text font-semibold">Course Description</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="textarea textarea-bordered w-full"
                placeholder="Describe what students will learn in this course..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div className="form-control">
                <label className="label" htmlFor="difficulty">
                  <span className="label-text font-semibold">Difficulty Level</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  required
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="" disabled>Select difficulty level</option>
                  <option value="Beginner" className="text-success">Beginner</option>
                  <option value="Intermediate" className="text-warning">Intermediate</option>
                  <option value="Advanced" className="text-error">Advanced</option>
                </select>
              </div>

              {/* Thumbnail URL */}
              <div className="form-control">
                <label className="label" htmlFor="thumbnail_url">
                  <span className="label-text font-semibold">Course Thumbnail URL</span>
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  required
                  className="input input-bordered w-full"
                  placeholder="https://example.com/image.jpg"
                />
                <label className="label">
                  <span className="label-text-alt text-info">Enter a valid image URL (JPG, PNG)</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                className="btn btn-primary flex-1 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create Course
              </button>
              <Link
                href="/"
                className="btn btn-outline flex-1"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}