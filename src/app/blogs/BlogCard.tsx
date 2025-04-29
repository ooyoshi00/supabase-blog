import Link from 'next/link'
import { CalendarIcon, TagIcon } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  pathname: string
  excerpt?: string
  date?: string
  tags?: string[]
  image?: string
}

const BlogCard: React.FC<BlogPost> = (post) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <Link href={`/blogs/${post.pathname}`}>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <time dateTime={post.date}>{post.date}</time>
        </div>
        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogCard
