import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/navbar";
import { ThemeProvider } from "./components/ui/theme-provider";
import Footer from "./components/layout/footer";

import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MiniCourse - Learn Something New Today",
    template: "%s | MiniCourse",
  },
  description:
    "Discover and enroll in high-quality online courses to enhance your skills and advance your career. Learn at your own pace with expert instructors.",
  keywords: [
    "online courses",
    "e-learning",
    "education",
    "online learning",
    "skill development",
    "professional courses",
  ],
  authors: [{ name: "MiniCourse Team" }],
  creator: "MiniCourse",
  publisher: "MiniCourse",
  metadataBase: new URL("https://minicourse.netlify.app"),
  openGraph: {
    title: "MiniCourse - Learn Something New Today",
    description:
      "Discover and enroll in high-quality online courses to enhance your skills and advance your career.",
    url: "https://minicourse.netlify.app",
    siteName: "MiniCourse",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MiniCourse - Online Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiniCourse - Learn Something New Today",
    description:
      "Discover and enroll in high-quality online courses to enhance your skills and advance your career.",
    images: ["/twitter-image.jpg"],
    creator: "@minicourse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />
            <main className="mt-[80px] p-4 dark:bg-base-900 dark:text-base-content dark:border-base-800">
              {children}
            </main>
            <Footer />
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
