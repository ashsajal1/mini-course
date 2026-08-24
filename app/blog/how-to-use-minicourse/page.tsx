import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarCheck,
  Gauge,
  Lightbulb,
  PenLine,
  Repeat,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How to Use MiniCourse Wisely",
  description:
    "Practical tips to learn smarter on MiniCourse — build habits, use progress tracking, and get the most from every mini course.",
};

const tips = [
  {
    icon: Target,
    title: "Start with a clear goal",
    body: "Before browsing, decide what you actually want to learn this month. Then filter by that topic and difficulty instead of enrolling in whatever looks shiny. One focused course finished beats five abandoned ones.",
  },
  {
    icon: Gauge,
    title: "Match the course to your level",
    body: "Every card shows its difficulty badge — Beginner (green), Intermediate (amber), Advanced (blue). If you're new to a subject, start at Beginner even if it feels slow; gaps in fundamentals are the #1 reason people stall halfway.",
  },
  {
    icon: Bookmark,
    title: "Build a queue with Save for later",
    body: "See an interesting course but can't start it now? Hit the bookmark icon to save it. Your saved list lives on your profile, so you always have a ready-made 'next up' queue instead of re-searching every time.",
  },
  {
    icon: CalendarCheck,
    title: "Learn small, but daily",
    body: "Mini courses are designed for short sessions. Ten focused minutes a day beats a two-hour binge once a week — consistency is what moves your progress bar. Tie it to an existing habit, like one module with your morning coffee.",
  },
  {
    icon: Repeat,
    title: "Don't skip the practice questions",
    body: "Quizzes feel optional; they're not. Testing yourself is one of the most effective ways to make knowledge stick. Get a question wrong? That's exactly what to review before moving on.",
  },
  {
    icon: TrendingUp,
    title: "Check My Learning weekly",
    body: "Your profile's My Learning section shows a live progress bar per course. Make it a weekly ritual: finish anything close to 100% first — completed courses give you momentum (and full XP) rather than a graveyard of half-done modules.",
  },
  {
    icon: Star,
    title: "Rate what you finish",
    body: "Leaving an honest star rating takes ten seconds and sharpens the whole catalog — good courses rise, weak ones become visible. It also forces you to reflect on what you just learned.",
  },
  {
    icon: PenLine,
    title: "Teach it to keep it",
    body: "The fastest way to lock in a skill is to explain it. Once you've completed a few courses, create a mini course yourself. Writing modules for others will expose exactly which parts you haven't truly mastered yet.",
  },
];

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 pt-12 pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
              <Lightbulb className="h-3.5 w-3.5" />
              Guide
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.15]">
              How to use MiniCourse wisely
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Eight practical habits to learn more in less time — using the
              features you already have.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-4">
              Aug 24, 2026 · 6 min read
            </p>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed mb-10">
            MiniCourse gives you short courses, progress tracking, and quizzes —
            but tools only work if you use them well. Here are eight habits that
            will help you actually finish what you start and remember what you
            learn.
          </p>

          <ol className="space-y-4">
            {tips.map((tip) => (
              <li key={tip.title}>
                <div className="rounded-2xl bg-card ring-1 ring-border p-6 sm:p-7 flex gap-4 sm:gap-5">
                  <span className="grid place-items-center h-11 w-11 shrink-0 rounded-xl bg-primary/10 text-primary">
                    <tip.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-bold tracking-tight text-lg mb-1.5">
                      {tip.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tip.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-card ring-1 ring-border p-8 text-center">
            <h2 className="text-xl font-extrabold tracking-tight mb-2">
              Put it into practice
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Pick one course, set a daily slot, and watch your progress bar
              move.
            </p>
            <Link href="/course" className="btn btn-primary gap-2 mx-auto">
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
