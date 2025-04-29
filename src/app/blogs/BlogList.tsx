import path from 'path'
import fs from 'fs'
import { readFile } from 'node:fs/promises'
import { compileMDX } from 'next-mdx-remote/rsc'
import BlogCard from './BlogCard'
// import { Button } from '@/components/ui/button'
import Sidebar from '../_component/SideBar'

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'mdx')
  const filenames = fs
    .readdirSync(postsDirectory, {
      withFileTypes: true
    })
    .filter((dirent) => dirent.isDirectory)
  const result = await Promise.all(
    filenames.map(async (direct) => {
      const mdx = await loadMDX(direct.name)
      return await { pathname: direct.name, frontmatter: mdx.frontmatter }
    })
  )
  return result
}

/**
 * @param dir urlのroute（p1,p2,p3）
 */
async function loadMDX(dir: string) {
  const root = path.resolve()
  const mdxpath = path.join(root, 'mdx', dir, 'page.mdx')
  const data = await readFile(mdxpath, { encoding: 'utf-8' })
  // mdxをパースする。
  // remark,rehypeのプラグインを指定する場合、またfront-matterもパースする場合、ここで指定する
  return compileMDX({
    source: data,
    options: {
      parseFrontmatter: true
    }
  })
}

const BlogList = async () => {
  const posts = await getPosts()
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">最新の記事</h1>
        <div className="space-y-8">
          {posts.map((post, id) => (
            <BlogCard
              key={id}
              id={id}
              pathname={post.pathname}
              title={post.frontmatter.title as string}
              date={post.frontmatter.date as string}
            />
          ))}
        </div>
        {posts.length > 5 && (
          <div className="mt-8 text-center">
            <button>もっと見る</button>
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  )
}

export default BlogList
