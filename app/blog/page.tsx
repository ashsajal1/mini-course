import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, tips, and updates from the MiniCourse team to help you learn smarter.",
};

const posts = [
  {
    slug: "how-to-use-minicourse",
    tag: "Guide",
    icon: Lightbulb,
    title: "How to use MiniCourse wisely",
    excerpt:
      "Eight practical habits to learn more in less time — from picking the right difficulty to building a daily learning routine with the features you already have.",
    readTime: "6 min read",
    date: "Aug 24, 2026",
  },
];

export default function BlogPage() {
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
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            MiniCourse Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guides, tips, and updates to help you get the most out of your
            learning.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl bg-card ring-1 ring-border p-6 sm:p-7 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  <post.icon className="h-3 w-3" />
                  {post.tag}
                </span>
                <span>{post.date}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-2.5">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
