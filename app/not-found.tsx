import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary">404</div>
          <div className="text-2xl font-semibold mt-2 text-base-content">Page Not Found</div>
          <p className="mt-4 text-base-content/80">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button 
            aria-label="Search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-base-content/60 hover:text-primary"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <Link href="/courses" className="btn btn-outline">
            Browse Courses
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-6 border-t border-base-300">
          <h3 className="text-lg font-medium mb-4">Need help?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="link link-hover text-primary">
              Contact Support
            </a>
            <span className="text-base-content/50">•</span>
            <a href="/faq" className="link link-hover text-primary">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}