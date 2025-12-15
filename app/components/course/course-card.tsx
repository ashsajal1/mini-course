"use client";
import Image from "next/image";
import { ArrowRight, Users, Globe } from "lucide-react";
import Link from "next/link";
import { getCourseEnrollmentCount } from "@/lib/enrollment-service";
import { getAverageRating } from "@/lib/rating-service";
import { useEffect, useState } from "react";
import SaveCourseButton from "./save-course-button";
import StarRating from "../ui/star-rating";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  lang: string;
  thumbnail_url: string;
  moduleCount: number;
};

export default function CourseCard({
  id,
  title,
  description,
  difficulty,
  lang,
  thumbnail_url,
  moduleCount,
}: CourseCardProps) {
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [count, rating] = await Promise.all([
          getCourseEnrollmentCount(id),
          getAverageRating(id),
        ]);
        setEnrollmentCount(count);
        setRatingData(rating);
      } catch (error) {
        console.warn("Failed to fetch course data:", error);
        // Set defaults on error
        setEnrollmentCount(0);
        setRatingData({ average: 0, count: 0 });
      }
    };
    fetchData();
  }, [id]);

  return (
    <article
      key={id}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <figure className="relative h-40 w-full bg-base-200">
        <Image
          src={thumbnail_url || "/next.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
          priority={false}
        />
      </figure>
      <div className="card-body p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="card-title text-base text-base-content">{title}</h2>
          <div className="flex items-center gap-2">
            <div className="badge badge-outline">{difficulty}</div>
            <div className="badge badge-info badge-sm">
              <Globe className="h-3 w-3 mr-1" />
              {(lang || 'en').toUpperCase()}
            </div>
          </div>
        </div>
        <p className="text-sm text-base-content/80 line-clamp-2 mt-2">
          {description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <Users className="h-4 w-4" />
            <span>{enrollmentCount} students</span>
          </div>
          <div className="text-sm text-base-content/70">
            {moduleCount} modules
          </div>
        </div>
        {ratingData.count > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={ratingData.average} size={14} showValue />
            <span className="text-xs text-base-content/60">
              ({ratingData.count})
            </span>
          </div>
        )}
        <div className="card-actions justify-end mt-4">
          <SaveCourseButton courseId={id} />
          <Link href={`course/${id}`} className="btn btn-primary btn-sm">
            View Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
