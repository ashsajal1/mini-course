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
import CourseRating from "./course-rating";
import { Accordion } from "radix-ui";

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

      <div className="card shadow-xl overflow-hidden">
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
              <span className="badge badge-accent gap-2">
                <Award className="h-3 w-3" />
                {course.difficulty}
              </span>
              <span className="badge badge-ghost gap-2">
                <Clock className="h-3 w-3" />
                10 hours
              </span>
            </div>
          </div>
        </figure>

        <div className="p-6">
          {/* Course Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-muted-foreground">{course.description}</p>

            <h3 className="text-xl font-bold mt-8 mb-4">Course Modules</h3>
            <Accordion.Root type="single" defaultValue={course.modules[0]?.id} collapsible className="space-y-2">
              {course.modules.map((courseModule) => (
                <Accordion.Item
                  key={courseModule.id}
                  value={courseModule.id}
                  className="border bg-muted rounded-lg overflow-hidden"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-lg font-medium hover:bg-accent transition-colors [&[data-state=open]>svg]:rotate-180">
                      {courseModule.title}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform"><path d="m6 9 6 6 6-6"/></svg>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-4 pb-4 data-[state=open]:animate-in data-[state=closed]:animate-out">
                    <div className="text-sm text-muted-foreground">Module content</div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>

          {ratingData.count > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Course Rating</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={ratingData.average} size={20} showValue />
                <span className="text-muted-foreground">
                  ({ratingData.count} review{ratingData.count !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          )}

          {clerkId && <CourseRating courseId={id} />}

          <div className="flex justify-end gap-2 mt-8">
            {!clerkId ? (
              <Link href="/sign-in" className="btn btn-primary gap-2">
                Sign In to Enroll
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : isEnrolled ? (
              <Link
                href={`/course/learn/${id}`}
                className="btn btn-primary gap-2"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
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
