import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Compass, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-xl mx-auto">
        {/* 404 */}
        <div className="mb-8">
          <p
            aria-hidden
            className="text-[6rem] sm:text-[8rem] leading-none font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent select-none"
          >
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-2">
            Page not found
          </h1>
          <p className="mt-3 text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <Link href="/course" className="btn btn-outline btn-lg gap-2">
            <BookOpen className="h-5 w-5" />
            Browse Courses
          </Link>
        </div>

        {/* Help links */}
        <div className="pt-6 border-t border-border">
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground mb-4">
            <Compass className="h-4 w-4" />
            Looking for something else?
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/faq"
              className="font-semibold text-primary hover:underline"
            >
              FAQ
            </Link>
            <span className="text-border" aria-hidden>
              |
            </span>
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Support
            </Link>
            <span className="text-border" aria-hidden>
              |
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              Contact Us
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
