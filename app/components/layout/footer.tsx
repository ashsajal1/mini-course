import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Twitter, Linkedin, Facebook, Instagram, Youtube, BookOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Separator } from 'radix-ui';

interface FooterLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { name: 'Courses', href: '/course' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Create Course', href: '/course/create' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Support', href: '/support' },
      { name: 'Privacy', href: '/privacy' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { 
        name: 'support@minicourse.com', 
        href: 'mailto:support@minicourse.com',
        icon: <Mail className="w-4 h-4" />
      },
      { 
        name: '+1 (555) 123-4567', 
        href: 'tel:+15551234567',
        icon: <Phone className="w-4 h-4" />
      },
      { 
        name: 'San Francisco, CA', 
        href: 'https://maps.google.com',
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
];

const socialLinks = [
  { name: 'Twitter', icon: <Twitter className="w-4 h-4" />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, href: '#' },
  { name: 'Facebook', icon: <Facebook className="w-4 h-4" />, href: '#' },
  { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, href: '#' },
  { name: 'YouTube', icon: <Youtube className="w-4 h-4" />, href: '#' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">MiniCourse</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-sm">
              A modern, Radix-powered learning platform for bite-sized courses. Build skills at your own pace — mobile friendly, self-paced, and free to start.
            </p>
            <div className="flex gap-2 mt-6">
              {socialLinks.map((social) => (
                <Button key={social.name} asChild variant="ghost" size="icon" className="rounded-full border" aria-label={social.name}>
                  <a href={social.href}>{social.icon}</a>
                </Button>
              ))}
            </div>
          </div>

          {/* Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator.Root className="my-8 h-px bg-border" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MiniCourse. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-1">
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              <Link href="/terms">Terms</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              <Link href="/privacy">Privacy</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              <Link href="/cookies">Cookies</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              <Link href="/about">About</Link>
            </Button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
