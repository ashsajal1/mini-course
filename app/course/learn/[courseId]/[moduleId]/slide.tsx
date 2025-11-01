"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import "highlight.js/styles/github-dark.css";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Prisma } from "@/app/generated/prisma/client";

type SlideType = Prisma.SlideGetPayload<{
  include: {
    content_item: true;
  };
}>;

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Slide({ slide }: { slide: SlideType }) {
  const components: Components = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-4xl font-bold my-6" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-3xl font-bold my-5" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-2xl font-bold my-4" {...props} />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="my-4 leading-relaxed" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className="text-blue-500 hover:text-blue-700 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code: (props: CodeProps) => {
      const { className, children, inline, ...rest } = props;
      const isInline = inline ?? false;
      
      if (isInline) {
        return (
          <code
            className="bg-base-200 dark:bg-base-300 px-1.5 py-0.5 rounded"
            {...rest}
          >
            {children}
          </code>
        );
      }
      
      return (
        <pre className="bg-base-200 dark:bg-base-300 p-4 rounded-lg overflow-x-auto my-4">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    },
    blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="border-l-4 border-primary pl-4 italic my-4"
        {...props}
      />
    ),
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{slide?.title || 'Untitled Slide'}</h1>

      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {slide?.content || ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}
