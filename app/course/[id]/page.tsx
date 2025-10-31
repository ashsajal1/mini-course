import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bookmark, Clock, Award } from "lucide-react";
import prisma from "@/app/lib/client";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await prisma.course.findFirst({
    where: {
      id,
    },
    include: {
      modules: true,
    },
  });

  console.log(course);

  // If course ID doesn't match, show 404
  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="btn btn-ghost gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        {/* Course Header */}
        <figure className="relative h-64">
          <Image
            src={course.thumbnail_url || "/placeholder-course.jpg"}
            alt={course.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            <div className="flex items-center gap-4">
              <div className="badge badge-accent gap-2">
                <Award className="h-3 w-3" />
                {course.difficulty}
              </div>
              <div className="badge badge-ghost gap-2">
                <Clock className="h-3 w-3" />
                10 hours
              </div>
            </div>
          </div>
        </figure>

        <div className="card-body">
          {/* Course Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="avatar-group -space-x-4">
                <div className="avatar">
                  <div className="w-10">
                    <Image
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      alt="Student avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-10">
                    <Image
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      alt="Student avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              <span className="text-sm">+20 students enrolled</span>
            </div>
            <button className="btn btn-ghost gap-2">
              <Bookmark className="h-4 w-4" />
              Save for later
            </button>
          </div>

          {/* Course Content */}
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p className="text-base-content/80">{course.description}</p>

            <h3 className="text-xl font-bold mt-8 mb-4">Course Modules</h3>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="collapse collapse-arrow bg-base-200"
                >
                  <input
                    aria-label="module"
                    type="radio"
                    name="my-accordion-2"
                    defaultChecked={index === 0}
                  />
                  <div className="collapse-title text-lg font-medium">
                    {module.title}
                  </div>
                  {/* <div className="collapse-content">
                    <div
                      className="prose-sm mt-2"
                      dangerouslySetInnerHTML={{ __html: module.content }}
                    />
                    {module.has_quiz && (
                      <div className="mt-4">
                        <span className="badge badge-primary gap-2">
                          Quiz Available
                        </span>
                      </div>
                    )}
                  </div> */}
                </div>
              ))}
            </div>
          </div>

          <div className="card-actions justify-end gap-2 mt-8">
            <Link
              href={`/course/edit/${id}`}
              className="btn btn-outline gap-2"
            >
              Edit Course
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Link>
            <Link
              href={`/course/learn/${id}`}
              className="btn btn-primary gap-2"
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
