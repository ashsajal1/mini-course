"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";
import { SignedOut, SignInButton, SignedIn, UserAvatar } from "@clerk/nextjs";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/course" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 h-16 border-b transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm"
          : "bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">MiniCourse</span>
        </Link>

        {/* Desktop nav - Radix Navigation pattern with native links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "inline-flex items-center justify-center rounded-md h-8 px-3 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
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
            <Link href="/profile" className="ml-2">
              <UserAvatar />
            </Link>
          </SignedIn>
        </div>

        {/* Mobile trigger */}
        <div className="md:hidden flex items-center gap-1">
          <ModeToggle />
          <button
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer - Radix Dialog Primitive (right sheet) directly */}
      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <DialogPrimitive.Content
            className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[320px] bg-background border-l shadow-xl flex flex-col outline-none md:hidden"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">Navigation menu</DialogPrimitive.Title>
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-bold">MiniCourse</span>
              </Link>
              <button className="btn btn-ghost btn-square btn-sm" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="space-y-2">
                <Link href="/course/create" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">
                  Create Course
                </Link>
                <SignedOut>
                  <SignInButton>
                    <button className="btn btn-outline w-full">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full justify-start">
                    My Profile
                  </Link>
                </SignedIn>
              </div>
            </div>

            <div className="p-4 border-t text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} MiniCourse. All rights reserved.
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
}
