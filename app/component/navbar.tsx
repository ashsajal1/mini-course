"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserAvatar,
} from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/course" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 h-20 flex items-center transition-all duration-300 ${
        scrolled
          ? "bg-base-100/90 dark:bg-base-300/90 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      } border-b border-base-200 dark:border-base-300`}
    >
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold text-base-content">
            Mini Course
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`btn btn-ghost btn-sm ${
                pathname === item.href
                  ? "text-primary"
                  : "text-base-content hover:bg-base-200 hover:bg-opacity-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/course/create" className="btn btn-primary btn-sm">
            Create Course
          </Link>
          <ModeToggle />

          <SignedOut>
            <SignInButton>
              <button className="btn btn-primary btn-sm">Sign In</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/profile">
              <UserAvatar />
            </Link>
          </SignedIn>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-square btn-sm text-base-content"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-base-100 shadow-lg border-t border-base-200">
          <div className="px-2 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`btn btn-ghost btn-block justify-start ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-base-content hover:bg-base-200 hover:bg-opacity-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-2 py-2">
              <div className="px-2">
                <ModeToggle />
              </div>
            </div>
            <div className="px-2 pt-2">
              <Link
                href="/course/create"
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Course
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
