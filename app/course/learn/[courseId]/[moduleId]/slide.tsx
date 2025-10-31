import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github-dark.css";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Prisma } from "@/app/generated/prisma/client";

type SlideType = Prisma.SlideGetPayload<{
  include: {
    content_item: true;
  };
}>;

export default async function Slide({ slide }: { slide: SlideType }) {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{slide.content}</h1>

      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-4xl font-bold my-6" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-bold my-5" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-2xl font-bold my-4" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="my-4 leading-relaxed" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-blue-500 hover:text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            code: ({ node, inline, className, children, ...props }) => {
              if (inline) {
                return (
                  <code
                    className="bg-base-200 dark:bg-base-300 px-1.5 py-0.5 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-base-200 dark:bg-base-300 p-4 rounded-lg overflow-x-auto my-4">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-primary pl-4 italic my-4"
                {...props}
              />
            ),
          }}
        >
          {slide.content || ""}
        </ReactMarkdown>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 pt-4 border-t border-base-300 flex justify-between">
        <button
          className="btn btn-outline"
          // Add your navigation logic here
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          // Add your navigation logic here
        >
          Next
        </button>
      </div>
    </div>
  );
}
