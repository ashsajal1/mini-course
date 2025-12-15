import Link from "next/link";
import { ArrowRight, FileText, Link as LinkIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Course",
};

export default async function CreateCoursePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Create a New Course</h1>
          <p className="text-xl text-base-content/70">
            Choose how you'd like to create your course
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Manual Creation Card */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="card-title text-xl">Manual Creation</h2>
              </div>

              <p className="text-base-content/70 mb-6">
                Start from scratch and manually define your course structure,
                modules, and content. Full control over every aspect.
              </p>

              <div className="card-actions justify-end">
                <Link href="/course/create/manual" className="btn btn-primary">
                  Create Manually
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* URL-Based Creation Card */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-2 border-primary/20">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <LinkIcon className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="card-title text-xl">Generate from Document</h2>
                <div className="badge badge-secondary badge-sm">AI-Powered</div>
              </div>

              <p className="text-base-content/70 mb-6">
                Upload a document URL and let AI generate a complete course
                with modules, slides, and questions automatically.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span>Google Docs, PDFs, Web Articles</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span>AI-Generated Content & Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span>Fully Editable Results</span>
                </div>
              </div>

              <div className="card-actions justify-end">
                <Link href="/course/create/url" className="btn btn-secondary">
                  Generate from URL
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-base-content/60">
            Need help deciding? The AI-powered option is great for quick course creation,
            while manual creation gives you complete control.
          </p>
        </div>
      </div>
    </div>
  );
}
