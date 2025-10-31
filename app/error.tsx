'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-100">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-error/10 text-error mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-error-content mb-4">
          Something went wrong!
        </h1>
        
        <p className="text-lg text-base-content/80 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        <div className="bg-base-200 dark:bg-base-300 rounded-lg p-4 mb-8 text-left">
          <p className="font-mono text-sm text-error">
            {error.message || 'An unknown error occurred'}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs opacity-75">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary gap-2"
            aria-label="Try again"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link href="/" className="btn btn-outline gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-12 pt-6 border-t border-base-300">
          <p className="text-base-content/70 mb-4">
            If the problem persists, please contact our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="link link-hover text-primary flex items-center gap-1"
            >
              Contact Support
            </a>
            <span className="text-base-content/30 hidden sm:inline">•</span>
            <a
              href="mailto:support@minicourse.com"
              className="link link-hover text-primary flex items-center gap-1"
            >
              support@minicourse.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}