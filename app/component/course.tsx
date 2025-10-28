import Image from "next/image";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  thumbnail_url: string;
};

export default function CourseCard({
  id,
  title,
  description,
  difficulty,
  thumbnail_url,
}: CourseCardProps) {
  return (
    <article
      key={id}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-36 w-full bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={thumbnail_url || "/next.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {difficulty}
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {description}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-sm btn-ghost">
            <Bookmark className="h-4 w-4" />
            Save
          </button>
          <Link href={`course/${id}`}>
            <button className="btn btn-sm btn-primary">
              Start Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
