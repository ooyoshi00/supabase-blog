import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fs from 'fs'
import TableOfContents from '../TableOfComponents'
import BlogPost from './BlogPost'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const postsDirectory = path.join(process.cwd(), 'mdx')
  const filenames = fs.readdirSync(postsDirectory)
  return filenames.map((filename) => ({
    id: filename.replace(/\.mdx?$/, '')
  }))
}

/**
 * @param dir urlのroute（p1,p2,p3）
 */
async function loadMDX(dir: string) {
  try {
    const root = path.resolve()
    const mdxpath = path.join(root, 'mdx', dir, 'page.mdx')
    const data = await readFile(mdxpath, { encoding: 'utf-8' })
    const parsed = matter(data)
    return parsed
  } catch (error) {
    console.error('Error loading MDX:', error)
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({params}:any) {
  const id = params.id
  if (!id) {
    notFound()
  }

  const parsed = await loadMDX(id)
  if (!parsed) {
    notFound()
  }

  const { title, date } = parsed.data
  const mdText = parsed.content

  const post = {
    title,
    date,
    mdText,
    author: '',
    tags: []
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <div className="sticky top-8">
            <TableOfContents content={mdText} />
          </div>
        </aside>
        <article className="md:w-3/4">
          <BlogPost post={post} />
        </article>
      </div>
    </div>
  )
}
