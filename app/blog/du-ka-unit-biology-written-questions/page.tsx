import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";

export const metadata: Metadata = {
  title: "ঢাবি ‘ক’ ইউনিট জীববিজ্ঞান লিখিত প্রশ্ন (২০১৯–২০২৫)",
  description:
    "ঢাকা বিশ্ববিদ্যালয়ের ‘ক’ ইউনিট ভর্তি পরীক্ষার জীববিজ্ঞান বিষয়ের বছরভিত্তিক লিখিত প্রশ্নাবলি — ২০১৯-২০২০ থেকে ২০২৪-২০২৫ সেশন পর্যন্ত।",
};

type Question = { q: string; sub?: string[] };
type YearSection = { session: string; ref: string; questions: Question[] };

const sections: YearSection[] = [
  {
    session: "২০২৪-২০২৫",
    ref: "[১৫]",
    questions: [
      { q: "স্থায়ী টিস্যুর পাঁচটি বৈশিষ্ট্য লিখ।" },
      { q: "C₄ উদ্ভিদের পাঁচটি বৈশিষ্ট্য লিখ।" },
      {
        q: "Porifera এবং Echinodermata পর্বের দুটি করে পৃথকীকরণ বৈশিষ্ট্য এবং একটি করে উদাহরণ লিখ।",
      },
      {
        q: "মানুষের খাদ্য পরিপাকে সাহায্যকারী পাঁচটি হরমোনের প্রধান কাজ লিখ।",
      },
    ],
  },
  {
    session: "২০২৩-২০২৪",
    ref: "[২৮]",
    questions: [
      { q: "ব্যাকটেরিয়ার ফ্ল্যাজেলা এবং পিলির মধ্যে পাঁচটি পার্থক্য লিখ।" },
      {
        q: "জিন ক্লোনিং বলতে কী বোঝায়? রিকম্বিনেন্ট ডিএনএ টেকনোলজির ধাপগুলো উল্লেখ কর।",
      },
      {
        q: "শ্রেণিবিন্যাসের ভিত্তি হিসেবে প্রাণীর জীবনপদ্ধতি প্রধানত কত ভাগে ভাগ করা যায়, সংক্ষেপে ব্যাখ্যা কর।",
      },
      { q: "Hydra-র একটি আদর্শ নিডোসাইটের অংশগুলো উল্লেখ কর।" },
    ],
  },
  {
    session: "২০২২-২০২৩",
    ref: "[৪২]",
    questions: [
      { q: "Poaceae গোত্রের পাঁচটি প্রধান সনাক্তকারী বৈশিষ্ট্য লিখ।" },
      { q: "ভাজক কলা ও স্থায়ী কলার মধ্যে পাঁচটি প্রধান পার্থক্য লিখ।" },
      { q: "হার্ট অ্যাটাকের পাঁচটি লক্ষণ উল্লেখ কর।" },
      {
        q: "নিচের প্রাণীগুলোর বৈজ্ঞানিক নাম লিখ:",
        sub: ["গৃহ মাছি", "গোলকৃমি", "রুই মাছ", "দোয়েল", "গোখরা সাপ"],
      },
    ],
  },
  {
    session: "২০২১-২০২২",
    ref: "[৫৭]",
    questions: [
      { q: "মালভেসি গোত্রের পাঁচটি শনাক্তকারী বৈশিষ্ট্য লেখ।" },
      { q: "Arthropoda পর্বের প্রাণীর পাঁচটি শনাক্তকারী বৈশিষ্ট্য লেখ।" },
      { q: "সালোকসংশ্লেষণ ও শ্বসনের মধ্যে প্রধান পাঁচটি পার্থক্য লেখ।" },
      { q: "বিবর্তনের স্বপক্ষে পাঁচটি প্রমাণ উল্লেখ কর।" },
    ],
  },
  {
    session: "২০২০-২০২১",
    ref: "[৭০]",
    questions: [
      {
        q: "DNA প্রতিলিপন বলতে কী বোঝ? DNA প্রতিলিপনের জন্য প্রয়োজনীয় চারটি উপকরণের নাম লিখ।",
      },
      {
        q: "একবীজপত্রী উদ্ভিদের কাণ্ডের অন্তর্গঠনের পাঁচটি শনাক্তকারী বৈশিষ্ট্য লিখ।",
      },
      {
        q: "Platyhelminthes এবং Nemathelminthes এর পাঁচটি প্রধান পার্থক্য লিখ।",
      },
      { q: "মানবদেহের যে কোনো ১০টি করোটিক স্নায়ুর নাম লিখ।" },
    ],
  },
  {
    session: "২০১৯-২০২০",
    ref: "[৮৪]",
    questions: [
      {
        q: "সালোকসংশ্লেষণের রাসায়নিক বিক্রিয়াটি লিখ এবং সালোকসংশ্লেষণের দুইটি গুরুত্বপূর্ণ কাজ উল্লেখ কর।",
      },
      {
        q: "একবীজপত্রী উদ্ভিদের মূলের অন্তর্গঠনগত শনাক্তকারী ছয়টি বৈশিষ্ট্য লিখ।",
      },
      {
        q: "গণ পর্যন্ত মানুষের শ্রেণিবিন্যাস কর (পর্ব, উপ-পর্ব, শ্রেণী, বর্গ, গোত্র, গণ)।",
      },
      {
        q: "নিম্নোক্ত প্রাণীদের বৈজ্ঞানিক নাম লিখ:",
        sub: [
          "গোলকৃমি (Round worm)",
          "আপেল শামুক (Apple snail)",
          "জোঁক (Leech)",
          "রুইমাছ (Rohu fish)",
          "ঘড়িয়াল (Gharial)",
          "দোয়েল (Magpie robin)",
        ],
      },
    ],
  },
];

const bengaliDigits = ["১", "২", "৩", "৪", "৫", "৬"];

export default function DuBiologyBlogPostPage() {
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
              <FlaskConical className="h-3.5 w-3.5" />
              Biology
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.2]">
              ঢাকা বিশ্ববিদ্যালয় ‘ক’ ইউনিট — জীববিজ্ঞান লিখিত প্রশ্ন
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ২০১৯-২০২০ থেকে ২০২৪-২০২৫ সেশন পর্যন্ত বছরভিত্তিক লিখিত
              প্রশ্নাবলি।
            </p>
            <p className="text-xs text-muted-foreground/70 mt-4">
              Aug 24, 2026 · ৮ মিনিট পড়া
            </p>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-card ring-1 ring-border p-6 sm:p-7 mb-10">
            <p className="text-sm leading-relaxed text-muted-foreground">
              ঢাকা বিশ্ববিদ্যালয়ের (ঢাবি) ‘ক’ ইউনিটের ভর্তি পরীক্ষায়{" "}
              <strong className="text-foreground">২০১৯-২০২০ সেশন</strong> থেকে
              লিখিত পরীক্ষা পদ্ধতি চালু করা হয়। এই পোস্টে সেই বছর থেকে{" "}
              <strong className="text-foreground">২০২৪-২০২৫ সেশন</strong>{" "}
              পর্যন্ত অনুষ্ঠিত সকল বছরের জীববিজ্ঞান (Biology) বিষয়ের লিখিত
              প্রশ্নগুলো বছরভিত্তিক সাজানো হলো।
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.session}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 pb-3 border-b border-border">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    ঢাবি ‘ক’ ভর্তি পরীক্ষা {section.session}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {section.ref}
                  </span>
                </div>

                <ol className="space-y-3">
                  {section.questions.map((question, qi) => (
                    <li key={qi}>
                      <div className="rounded-xl bg-card ring-1 ring-border p-4 sm:p-5 flex gap-3.5">
                        <span className="grid place-items-center h-7 w-7 shrink-0 rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {bengaliDigits[qi]}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm leading-relaxed text-foreground">
                            {question.q}
                          </p>
                          {question.sub && (
                            <ol className="mt-2 space-y-1 list-none">
                              {question.sub.map((item, si) => (
                                <li
                                  key={si}
                                  className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                                >
                                  <span className="font-semibold text-primary shrink-0">
                                    ({String.fromCharCode(97 + si)})
                                  </span>
                                  <span className="italic">{item}</span>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-card ring-1 ring-border p-8 text-center">
            <h2 className="text-xl font-extrabold tracking-tight mb-2">
              পরীক্ষার প্রস্তুতি নিতে চান?
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              MiniCourse-এ জীববিজ্ঞানের কোর্সে ভর্তি হয়ে মডিউল ও কুইজ প্র্যাকটিস
              করুন।
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
