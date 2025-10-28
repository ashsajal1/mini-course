// app/course/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import data from '@/app/mockdata.json';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: PageProps) {
  const course = data.course;
  
  // If course ID doesn't match, show 404
//   if (!course.id.endsWith(params.id)) {
//     notFound();
//   }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden">
        {/* Course Header */}
        <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={course.thumbnail_url || '/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                {course.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>About This Course</h2>
            <p>{course.description}</p>
            
            <h3 className="mt-8 mb-4">Course Modules</h3>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <h4 className="font-medium">{module.title}</h4>
                  <div 
                    className="prose-sm dark:prose-invert mt-2 line-clamp-2" 
                    dangerouslySetInnerHTML={{ __html: module.content }} 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button>
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}