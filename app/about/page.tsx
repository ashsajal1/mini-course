import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Eye,
  Lightbulb,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Quality Content",
      description:
        "Handpicked courses from industry experts to ensure a top-notch learning experience.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a growing community of learners and instructors passionate about sharing knowledge.",
    },
    {
      icon: Award,
      title: "Skill Certification",
      description:
        "Earn certificates upon course completion to showcase your new skills.",
    },
    {
      icon: Lightbulb,
      title: "Practical Learning",
      description:
        "Learn by doing with hands-on projects and real-world applications.",
    },
  ];

  const stats = [
    { value: "1000+", label: "Active Students" },
    { value: "50+", label: "Expert Instructors" },
    { value: "100+", label: "Courses Available" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const whyChooseUs = [
    "Flexible learning schedule",
    "Beginner to advanced levels",
    "Lifetime access to course materials",
    "Interactive learning experience",
    "Regular content updates",
    "Mobile-friendly platform",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 pt-16 pb-14 lg:pt-24 lg:pb-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            About Mini Course
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6">
            Empowering your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              learning journey
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-10">
            We believe in making quality education accessible to everyone,
            everywhere. Transform your future with comprehensive courses and
            expert instructors.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link
              href="/course"
              className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25"
            >
              Explore Courses
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="btn btn-ghost btn-lg ring-1 ring-border"
            >
              Contact Us
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <div className="flex -space-x-3">
              {["AK", "JS", "MT"].map((initials, i) => (
                <div
                  key={initials}
                  className={`grid place-items-center h-9 w-9 rounded-full text-[11px] font-bold ring-2 ring-background ${
                    ["bg-primary/90", "bg-primary/60", "bg-primary/30"][i]
                  } text-primary-foreground`}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by{" "}
              <span className="font-semibold text-foreground">1,000+</span>{" "}
              learners worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <header className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-muted-foreground">
              We&apos;re committed to providing the best learning experience
              with cutting-edge technology and industry-leading instructors.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl bg-card ring-1 ring-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/30"
              >
                <div className="mb-4 grid place-items-center h-12 w-12 rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="pb-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground px-6 py-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,currentcolor_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full ring-[28px] ring-primary-foreground/5" />
            <dl className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                    {stat.value}
                  </dt>
                  <dd className="text-xs uppercase tracking-wider text-primary-foreground/70">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Why learn with us */}
      <section className="py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
                Built For Learners
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                Why Learn With Us?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our platform is designed to help you achieve your learning goals
                with ease and efficiency. Whether you&apos;re starting a new
                career or upgrading your skills, we&apos;ve got you covered.
              </p>
              <ul className="space-y-3.5 mb-10">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid place-items-center h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/course"
                className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25"
              >
                Start Learning Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-card ring-1 ring-border p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">
                    Our Mission
                  </h3>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  To democratize education by making high-quality learning
                  resources accessible to people from all walks of life,
                  regardless of their location or financial status.
                </p>
              </div>
              <div className="rounded-2xl bg-card ring-1 ring-border p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary">
                    <Eye className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">
                    Our Vision
                  </h3>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  We envision a world where anyone, anywhere can transform
                  their life through accessible education and skill development,
                  creating opportunities for personal and professional growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground px-6 py-16 sm:py-20 text-center">
            <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,currentcolor_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full ring-[32px] ring-primary-foreground/5" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full ring-[24px] ring-primary-foreground/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Ready to Start Learning?
              </h2>
              <p className="max-w-2xl mx-auto text-primary-foreground/80 mb-8">
                Join thousands of students who are already advancing their
                careers with our courses.
              </p>
              <Link
                href="/course"
                className="btn btn-accent btn-lg text-base px-8"
              >
                Browse All Courses
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
