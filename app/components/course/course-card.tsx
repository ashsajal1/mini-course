"use client";
import Image from "next/image";
import { ArrowRight, Users, Globe } from "lucide-react";
import Link from "next/link";
import { getCourseEnrollmentCount } from "@/lib/enrollment-service";
import { getAverageRating } from "@/lib/rating-service";
import { useEffect, useState } from "react";
import SaveCourseButton from "./save-course-button";
import StarRating from "../ui/star-rating";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
    <Card
      key={id}
      className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <figure className="relative h-40 w-full bg-muted">
        <Image
          src={thumbnail_url || "/next.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
          priority={false}
        />
      </figure>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold leading-none tracking-tight">{title}</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{difficulty}</Badge>
            <Badge variant="info" size="sm" className="gap-1">
              <Globe className="h-3 w-3" />
              {(lang || 'en').toUpperCase()}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{enrollmentCount} students</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {moduleCount} modules
          </div>
        </div>
        {ratingData.count > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={ratingData.average} size={14} showValue />
            <span className="text-xs text-muted-foreground">
              ({ratingData.count})
            </span>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-3">
          <SaveCourseButton courseId={id} />
          <Button asChild size="sm" variant="primary">
            <Link href={`course/${id}`}>
              View Course
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
