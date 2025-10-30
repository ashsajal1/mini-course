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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">
          Create New Course
        </h1>

        <form action={createCourse} className="space-y-6">
          {/* Creator */}
          <div>
            <label
              htmlFor="creator"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Creator Name
            </label>
            <input
              type="text"
              id="creator"
              name="creator"
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
              placeholder="Enter your name"
            />
          </div>

          {/* Course Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Course Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
              placeholder="e.g., Introduction to React"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
              placeholder="Describe your course..."
            />
          </div>

          {/* Difficulty */}
          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
            >
              <option value="">Select difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label
              htmlFor="thumbnail_url"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail_url"
              name="thumbnail_url"
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
            <Link
              href="/"
              className="flex-1 text-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}