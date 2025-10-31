import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Twitter, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

interface FooterLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Courses', href: '/course' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Support', href: '/support' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { 
        name: 'support@minicourse.com', 
        href: 'mailto:support@minicourse.com',
        icon: <Mail className="w-4 h-4 mr-2" />
      },
      { 
        name: '+1 (555) 123-4567', 
        href: 'tel:+15551234567',
        icon: <Phone className="w-4 h-4 mr-2" />
      },
      { 
        name: '123 Learning St, San Francisco, CA', 
        href: 'https://maps.google.com',
        icon: <MapPin className="w-4 h-4 mr-2 shrink-0" />,
        className: 'flex items-start'
      },
    ],
  },
];

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const socialLinks: SocialLink[] = [
  { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: '#' },
  { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: '#' },
  { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: '#' },
  { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, href: '#' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 dark:bg-base-300 text-base-content">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold">
              MiniCourse
            </Link>
            <p className="mt-4 text-base-content/70">
              Empowering learners with quality education and practical skills for the modern world.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="btn btn-ghost btn-sm p-2 hover:bg-base-300 dark:hover:bg-base-200 rounded-full"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className={`flex items-center text-base-content/70 hover:text-primary transition-colors ${link.className || ''}`}
                    >
                      {link.icon && <span className="mr-2">{link.icon}</span>}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-base-content/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base-content/70 text-sm">
              © {currentYear} MiniCourse. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-base-content/70 hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-base-content/70 hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-base-content/70 hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
