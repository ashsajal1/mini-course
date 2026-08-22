import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Link as LinkIcon,
  Sparkles,
  Pencil,
  CheckCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Course",
};

export default async function CreateCoursePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Course Builder
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Create a New Course
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Choose how you would like to build your course — from scratch or
              with AI assistance.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Manual Creation Card */}
            <Link href="/course/create/manual" className="group block">
              <div className="card bg-card border border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 h-full">
                <div className="card-body p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Pencil className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="card-title text-xl">Manual Creation</h2>
                      <p className="text-sm text-foreground/50">
                        Full control
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Start from scratch and build every detail yourself — define
                    modules, write slides, and craft questions exactly how you
                    want them.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Custom module structure",
                      "Hand-crafted slides & content",
                      "Custom quiz questions",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="h-4 w-4 text-primary/70 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="card-actions justify-end mt-auto">
                    <span className="btn btn-primary btn-outline group-hover:btn-primary transition-colors">
                      Create Manually
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* URL-Based Creation Card */}
            <Link href="/course/create/url" className="group block">
              <div className="card bg-gradient-to-br from-base-100 to-secondary/5 border border-secondary/30 shadow-sm hover:shadow-xl hover:border-secondary/60 transition-all duration-300 h-full">
                <div className="card-body p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                      <LinkIcon className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="card-title text-xl">
                          Generate from URL
                        </h2>
                        <span className="badge badge-secondary badge-sm gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </span>
                      </div>
                      <p className="text-sm text-foreground/50">
                        AI-powered
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Paste a document URL and let AI generate a complete course
                    outline with modules, slides, and questions automatically.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Google Docs, PDFs, Web Articles",
                      "AI-generated content & questions",
                      "Fully editable after generation",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="h-4 w-4 text-secondary/70 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="card-actions justify-end mt-auto">
                    <span className="btn btn-secondary group-hover:scale-[1.02] transition-transform">
                      Generate from URL
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer hint */}
          <div className="text-center mt-12">
            <p className="text-sm text-foreground/40">
              Not sure? Try the AI option for a quick start — you can always
              edit everything afterward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
