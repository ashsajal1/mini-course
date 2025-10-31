import { BookOpen, Users, Award, Lightbulb, Check } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: 'Quality Content',
      description: 'Handpicked courses from industry experts to ensure top-notch learning experience.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Community Driven',
      description: 'Join a growing community of learners and instructors passionate about sharing knowledge.'
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: 'Skill Certification',
      description: 'Earn certificates upon course completion to showcase your new skills.'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: 'Practical Learning',
      description: 'Learn by doing with hands-on projects and real-world applications.'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Active Students' },
    { value: '50+', label: 'Expert Instructors' },
    { value: '100+', label: 'Courses Available' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  const whyChooseUs = [
    'Flexible learning schedule',
    'Beginner to advanced levels',
    'Lifetime access to course materials',
    'Interactive learning experience',
    'Regular content updates',
    'Mobile-friendly platform'
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Your Learning Journey</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
            We believe in making quality education accessible to everyone, everywhere.
            Transform your future with our comprehensive courses and expert instructors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/course" className="btn btn-accent text-accent-content">
              Explore Courses
            </Link>
            <Link href="/contact" className="btn btn-outline btn-accent">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-200 dark:bg-base-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-base-content/80 max-w-3xl mx-auto">
              We&apos;re committed to providing the best learning experience with cutting-edge technology
              and industry-leading instructors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="card-body items-center text-center">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-xl mb-2">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-base-content/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-base-200 dark:bg-base-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Why Learn With Us?</h2>
              <p className="text-lg mb-8 text-base-content/80">
                Our platform is designed to help you achieve your learning goals with ease and efficiency.
                Whether you&apos;re starting a new career or upgrading your skills, we&apos;ve got you covered.
              </p>
              <ul className="space-y-3">
                {whyChooseUs.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/course" className="btn btn-primary">
                  Start Learning Today
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-base-100 p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                <p className="mb-6 text-base-content/80">
                  To democratize education by making high-quality learning resources accessible to people
                  from all walks of life, regardless of their location or financial status.
                </p>
                <h3 className="text-2xl font-bold mb-6 mt-8">Our Vision</h3>
                <p className="text-base-content/80">
                  We envision a world where anyone, anywhere can transform their life through accessible
                  education and skill development, creating opportunities for personal and professional growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who are already advancing their careers with our courses.
          </p>
          <Link href="/course" className="btn btn-accent text-accent-content text-lg px-8 py-3">
            Browse All Courses
          </Link>
        </div>
      </section>
    </div>
  );
}