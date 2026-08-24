import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, LifeBuoy, Mail, MessageCircleQuestion } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with MiniCourse — browse common topics or contact our support team.",
};

const helpTopics = [
  {
    icon: BookOpen,
    title: "Getting started",
    description:
      "Create an account, browse the catalog, and enroll in your first mini course.",
    href: "/course",
    linkLabel: "Browse courses",
  },
  {
    icon: BookOpen,
    title: "Course creation",
    description:
      "Publish your own bite-sized courses with modules, lessons, and quizzes.",
    href: "/course/create",
    linkLabel: "Create a course",
  },
  {
    icon: MessageCircleQuestion,
    title: "Account & billing",
    description:
      "MiniCourse is free to use. Manage your profile, progress, and saved courses.",
    href: "/profile",
    linkLabel: "Go to profile",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <LifeBuoy className="h-3.5 w-3.5" />
            Support
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find quick answers below, or reach out to our team directly.
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {helpTopics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl bg-card ring-1 ring-border p-6 flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-shadow"
            >
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary mb-4">
                <topic.icon className="h-5 w-5" />
              </span>
              <h2 className="font-semibold tracking-tight mb-1.5">
                {topic.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {topic.description}
              </p>
              <Link
                href={topic.href}
                className="text-sm font-semibold text-primary hover:underline w-fit"
              >
                {topic.linkLabel} →
              </Link>
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary/80 text-primary-foreground p-8 sm:p-10 text-center">
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative">
              <span className="grid place-items-center h-12 w-12 rounded-full bg-white/20 ring-1 ring-white/30 mx-auto mb-4">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                Still need help?
              </h2>
              <p className="text-sm sm:text-base text-white/85 mb-6 max-w-md mx-auto">
                Our support team typically responds within one business day.
              </p>
              <Link
                href="/contact"
                className="btn btn-lg bg-white text-primary border-0 shadow-lg shadow-black/10"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
