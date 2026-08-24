import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about MiniCourse — AI-powered mini courses from docs, blogs, and documents.",
};

const faqs = [
  {
    q: "What is MiniCourse?",
    a: "MiniCourse is an AI-powered learning platform. Paste a link to any documentation, blog post, or article — or upload your own documents — and AI converts them into short, easy-to-learn concepts organized as courses.",
  },
  {
    q: "How do I create a course?",
    a: "Sign in and click Create Course in the navbar. Provide a source — a URL to documentation or a blog, or upload a document — and AI drafts modules, lessons, and practice questions for you. You can review and edit everything before publishing.",
  },
  {
    q: "Is MiniCourse free?",
    a: "Yes. Browsing, enrolling, and learning are completely free while we're in beta.",
  },
  {
    q: "Do I need an account to learn?",
    a: "You can browse all courses without an account. To enroll, track your progress, earn XP, save courses for later, or rate them, you'll need to sign in.",
  },
  {
    q: "How is my progress tracked?",
    a: "Every time you complete a module, your progress updates on your profile. The My Learning section shows a progress bar per course, plus stats for modules completed and total XP earned.",
  },
  {
    q: "Can I save courses for later?",
    a: "Yes — click the bookmark icon on any course card or course page. Saved courses appear in your profile so you always have a 'next up' queue ready.",
  },
  {
    q: "Can I rate and review courses?",
    a: "Absolutely. On any course detail page you can leave a star rating and written review. Honest ratings help other learners find the best content.",
  },
  {
    q: "Can I edit or remove a course I created?",
    a: "Yes. Your profile's My Created Courses section lists everything you've published with View and Edit options for each one.",
  },
  {
    q: "Who owns the content generated from my documents?",
    a: "Courses you generate from your own materials belong to you. You control whether they're published publicly or kept private.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            FAQ
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick answers about creating and learning on MiniCourse.
          </p>
        </div>
      </section>

      {/* FAQ list */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl bg-card ring-1 ring-border open:shadow-lg open:shadow-primary/5 transition-shadow"
            >
              <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer font-semibold tracking-tight select-none [&::-webkit-details-marker]:hidden group-open:text-primary">
                {faq.q}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="rounded-2xl bg-card ring-1 ring-border p-8 text-center">
            <h2 className="text-xl font-extrabold tracking-tight mb-2">
              Didn&apos;t find your answer?
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Our team is happy to help with anything else.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-primary gap-2">
                Contact Us
              </Link>
              <Link href="/support" className="btn btn-outline gap-2">
                Visit Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
