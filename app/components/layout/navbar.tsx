"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  Home,
  Info,
  LogIn,
  Mail,
  Menu,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";
import { SignedOut, SignInButton, SignedIn, UserAvatar } from "@clerk/nextjs";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Courses", href: "/course", icon: Compass },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
];

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

  // Close drawer on navigation
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 h-16 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md"
          : "bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 group-hover:-rotate-6">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Mini<span className="text-primary">Course</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative inline-flex items-center justify-center rounded-md h-8 px-3.5 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.name}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 -bottom-[14px] h-0.5 rounded-full bg-primary transition-all duration-300",
                  isActive(item.href)
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/course/create"
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
          <ModeToggle />
          <SignedOut>
            <SignInButton>
              <button className="btn btn-outline btn-sm gap-1.5">
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/profile"
              className="rounded-full ring-1 ring-border hover:ring-2 hover:ring-primary transition-all"
              title="My profile"
            >
              <UserAvatar />
            </Link>
          </SignedIn>
        </div>

        {/* Mobile trigger */}
        <div className="md:hidden flex items-center gap-1">
          <ModeToggle />
          <button
            className="btn btn-ghost btn-square btn-sm rounded-lg"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer - Radix Dialog Primitive (right sheet) */}
      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in" />
          <DialogPrimitive.Content
            className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[320px] bg-background border-l shadow-2xl flex flex-col outline-none md:hidden animate-sheet-in"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">
              Navigation menu
            </DialogPrimitive.Title>
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/25">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-extrabold tracking-tight">
                  Mini<span className="text-primary">Course</span>
                </span>
              </Link>
              <button
                className="btn btn-ghost btn-square btn-sm rounded-lg"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                  {isActive(item.href) && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="p-4 space-y-2 border-t shrink-0">
              <Link
                href="/course/create"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary w-full gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
              <SignedOut>
                <SignInButton>
                  <button className="btn btn-outline w-full gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-outline w-full justify-start gap-1.5"
                >
                  <UserRound className="h-4 w-4" />
                  My Profile
                </Link>
              </SignedIn>
            </div>

            <div className="px-4 pb-3 text-xs text-muted-foreground text-center shrink-0">
              © {new Date().getFullYear()} MiniCourse. All rights reserved.
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
}
