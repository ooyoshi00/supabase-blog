'use client'
import { CalendarIcon, TagIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface BlogPostProps {
  post: {
    title: string
    mdText: string
    date: string
    author: string
    tags: string[]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CodeBlock = ({ inline, className, children, }: any) => {
    if (inline) {
        return <code className={className}>{children}</code>;
    }
 
    const match = /language-(\w+)/.exec(className || '');
    if (!match) {
        return <code className={className}>{children}</code>;
    }
 
    const lang = match && match[1] ? match[1] : '';
 
    return (
        <SyntaxHighlighter
            style={atomDark}
            language={lang}
        >
            {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
    );
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
      <div className="flex items-center mb-4">
        {/* <Image
          src={post.author.image}
          alt={post.author.name}
          width={40}
          height={40}
          className="rounded-full mr-2"
        /> */}
        <span className="text-gray-600 mr-4">{post.author}</span>
        <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
        <time className="text-gray-600">{post.date}</time>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm flex items-center"
          >
            <TagIcon className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>
      <div className="prose prose-zinc max-w-none dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  paddingTop: '1rem',
                  paddingBottom: '1rem'
                }}
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  paddingTop: '1rem',
                  paddingBottom: '1rem'
                }}
                {...props}
              />
            ),
            h3: (props) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
            ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
            ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            table: (props) => (
              <div className="overflow-x-auto">
                <table className="table-auto border border-gray-300 text-left w-full mb-4" {...props} />
              </div>
            ),
            th: (props) => <th className="border px-4 py-2 bg-gray-100" {...props} />,
            td: (props) => <td className="border px-4 py-2" {...props} />,
            code: CodeBlock
          }}
        >
          {post.mdText}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default BlogPost
