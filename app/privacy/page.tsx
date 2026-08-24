import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how MiniCourse collects, uses, and protects your personal information.",
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Information We Collect",
    body: [
      "Account information: when you sign up we collect your name, email address, and profile image through our authentication provider (Clerk).",
      "Learning activity: your enrollments, course progress, completed modules, quiz attempts, saved courses, and ratings.",
      "Content you create: if you author courses, we store the course content, thumbnails, and modules you publish.",
      "Technical data: basic usage information such as browser type and pages visited, used to keep the platform running smoothly.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To provide the service: track your progress, show your enrolled and saved courses, and personalize your learning experience.",
      "To communicate with you about your account or important updates to the platform.",
      "To improve MiniCourse by understanding which courses and features are most useful.",
    ],
  },
  {
    title: "3. Third-Party Services",
    body: [
      "Authentication is handled by Clerk. When you sign in, Clerk processes your credentials and profile data according to its own privacy policy.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "4. Cookies",
    body: [
      "We use essential cookies and similar technologies to keep you signed in and remember your preferences such as theme selection. We do not use advertising or tracking cookies.",
    ],
  },
  {
    title: "5. Data Retention & Deletion",
    body: [
      "We retain your account and learning data for as long as your account is active.",
      "You may request deletion of your account and associated personal data at any time by contacting us. Course content you have published may be retained in anonymized form where required.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "Depending on your location, you may have the right to access, correct, export, or delete the personal data we hold about you.",
      "To exercise any of these rights, reach out through our contact page.",
    ],
  },
  {
    title: "7. Children's Privacy",
    body: [
      "MiniCourse is not directed at children under 13, and we do not knowingly collect personal information from children under 13.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this policy from time to time. Material changes will be announced on the platform. Continued use of MiniCourse after an update means you accept the revised policy.",
    ],
  },
];

export default function PrivacyPage() {
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
            <ShieldCheck className="h-3.5 w-3.5" />
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How we collect, use, and protect your information.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3">
            Last updated: August 24, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-muted-foreground leading-relaxed">
            Your privacy matters to us. This policy explains what information
            MiniCourse collects when you use our platform, why we collect it,
            and the choices you have.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.body.map((paragraph, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50"
                    />
                    {paragraph}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="rounded-2xl bg-card ring-1 ring-border p-6 sm:p-7 text-center">
            <h2 className="text-lg font-bold tracking-tight mb-2">
              Questions about this policy?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Get in touch and we&apos;ll be happy to help.
            </p>
            <Link href="/contact" className="btn btn-primary btn-sm gap-1.5 mx-auto">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
