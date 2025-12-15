import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Award,
  Users,
} from "lucide-react";
import prisma from "@/prisma/client";
import {
  getCourseEnrollmentCount,
  isEnrolledInCourse,
} from "@/lib/enrollment-service";
import { getAverageRating } from "@/lib/rating-service";
import EnrollButton from "./enroll-btn";
import { auth } from "@clerk/nextjs/server";
import StarRating from "@/app/components/ui/star-rating";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    select: { name: true, description: true, thumbnail_url: true },
  });

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.name,
    description: course.description,
    openGraph: {
      title: course.name,
      description: course.description,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: course.name,
      description: course.description,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
  };
}

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

  // If course ID doesn't match, show 404
  if (!course) {
    notFound();
  }

  const enrollmentCount = await getCourseEnrollmentCount(id);
  const isEnrolled = await isEnrolledInCourse(id);
  let ratingData = { average: 0, count: 0 };
  try {
    ratingData = await getAverageRating(id);
  } catch (error) {
    console.warn("Failed to fetch rating data:", error);
  }
  const { userId: clerkId } = await auth();

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
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-base-content/70" />
                <span className="text-sm">
                  {enrollmentCount} students enrolled
                </span>
              </div>
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
              {course.modules.map((courseModule, index) => (
                <div
                  key={courseModule.id}
                  className="collapse collapse-arrow bg-base-200"
                >
                  <input
                    aria-label="module"
                    type="radio"
                    name="my-accordion-2"
                    defaultChecked={index === 0}
                  />
                  <div className="collapse-title text-lg font-medium">
                    {courseModule.title}
                  </div>
                  {/* <div className="collapse-content">
                    <div
                      className="prose-sm mt-2"
                      dangerouslySetInnerHTML={{ __html: courseModule.content }}
                    />
                    {courseModule.has_quiz && (
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

          {ratingData.count > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Course Rating</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={ratingData.average} size={20} showValue />
                <span className="text-base-content/70">
                  ({ratingData.count} review{ratingData.count !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          )}

          <div className="card-actions justify-end gap-2 mt-8">
            {!clerkId ? (
              // If user is not logged in, direct them to sign in
              <Link href="/sign-in" className="btn btn-primary gap-2">
                Sign In to Enroll
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : isEnrolled ? (
              // If user is already enrolled, take them to the learning page
              <Link
                href={`/course/learn/${id}`}
                className="btn btn-primary gap-2"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              // If user is logged in but not enrolled, show enroll button
              <EnrollButton courseId={id} />
            )}

            {clerkId === course.creator && (
              <Link
                href={`/course/edit/${id}`}
                className="btn btn-outline gap-2"
              >
                Edit Course
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
