import Image from "next/image";
import { Bookmark, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { getCourseEnrollmentCount } from "@/lib/enrollment-service";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  thumbnail_url: string;
};

export default async function CourseCard({
  id,
  title,
  description,
  difficulty,
  thumbnail_url,
}: CourseCardProps) {
  const enrollmentCount = await getCourseEnrollmentCount(id);

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
          <h2 className="card-title text-base text-base-content">
            {title}
          </h2>
          <div className="badge badge-outline">
            {difficulty}
          </div>
        </div>
        <p className="text-sm text-base-content/80 line-clamp-2 mt-2">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-base-content/70">
          <Users className="h-4 w-4" />
          <span>{enrollmentCount} students</span>
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-ghost btn-sm text-base-content/70 hover:text-primary"
            aria-label="Save course"
          >
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </button>
          <Link href={`course/${id}`} className="btn btn-primary btn-sm">
            View Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
