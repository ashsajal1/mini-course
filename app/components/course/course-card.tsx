"use client";
import Image from "next/image";
import { ArrowRight, Globe, Layers, Users } from "lucide-react";
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

const difficultyBadge: Record<string, string> = {
  Beginner: "badge-success",
  Intermediate: "badge-warning",
  Advanced: "badge-info",
};

const FALLBACK_IMAGE = "/placeholder-course.svg";

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
  const [imgSrc, setImgSrc] = useState(thumbnail_url || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(thumbnail_url || FALLBACK_IMAGE);
  }, [thumbnail_url]);

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
        setEnrollmentCount(0);
        setRatingData({ average: 0, count: 0 });
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="group card relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      {/* Full-card click target */}
      <Link
        href={`/course/${id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${title}`}
      />

      <figure className="relative h-44 w-full overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        {/* Scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

        <span
          className={`absolute top-3 left-3 badge ${difficultyBadge[difficulty] ?? "badge-outline"} border-0 shadow-sm`}
        >
          {difficulty}
        </span>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Globe className="h-3 w-3" />
          {(lang || "en").toUpperCase()}
        </span>

        <SaveCourseButton
          courseId={id}
          className="absolute top-2.5 right-2.5 z-20 rounded-full bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
        />
      </figure>

      <div className="relative z-20 pointer-events-none p-5 pt-4 flex flex-col gap-2 flex-1">
        <h2 className="text-base font-semibold leading-snug tracking-tight line-clamp-1 transition-colors group-hover:text-primary">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {enrollmentCount}{" "}
            {enrollmentCount === 1 ? "student" : "students"}
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            {moduleCount} {moduleCount === 1 ? "module" : "modules"}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
          {ratingData.count > 0 ? (
            <StarRating rating={ratingData.average} size={14} showValue />
          ) : (
            <span className="text-xs italic text-muted-foreground">
              Not yet rated
            </span>
          )}
          <span className="pointer-events-none inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-2.5">
            View
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
