import Link from 'next/link'

const popularPosts = [
  { id: 1, title: 'Next.jsの基礎: App RouterとPages Routerの違い' },
  { id: 2, title: 'ReactとTypeScriptの組み合わせ: 型安全な開発の始め方' },
  { id: 3, title: 'Tailwind CSSのベストプラクティス: 効率的なスタイリング手法' }
]

const tags = [
  'Next.js',
  'React',
  'TypeScript',
  'フロントエンド',
  'バックエンド',
  'CSS',
  'GraphQL'
]

const Sidebar = () => {
  return (
    <aside className="md:w-1/4 space-y-8">
      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">人気の記事</h2>
        <ul className="space-y-2">
          {popularPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">タグ</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
