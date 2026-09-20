import { CalendarIcon } from "lucide-react";
import NextImage from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogPostProps = {
  title: string;
  publishedAtLabel: string;
  content: string;
  sourceUrl?: string;
};

const markdownComponents: Components = {
  img: ({ src, alt }) => {
    if (typeof src !== "string") {
      return null;
    }

    return (
      <NextImage
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(max-width: 896px) 100vw, 896px"
        className="h-auto w-full rounded-lg"
      />
    );
  },
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
};

const BlogPost = ({
  title,
  publishedAtLabel,
  content,
  sourceUrl,
}: BlogPostProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
      <div className="flex items-center mb-6 text-gray-600">
        <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
        <time className="text-gray-600">{publishedAtLabel}</time>
      </div>
      <div className="prose prose-zinc max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
      {sourceUrl ? (
        <p className="mt-8 border-t pt-4 text-sm text-gray-600">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            参考リンク
          </a>
        </p>
      ) : null}
    </div>
  );
};

export default BlogPost;
