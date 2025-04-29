import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'fs'
import TableOfContents from '../TableOfComponents'
import BlogPost from './BlogPost'
import matter from 'gray-matter'

export async function generateStaticParams() {
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
  const root = path.resolve()
  const mdxpath = path.join(root, 'mdx', dir, 'page.mdx')
  const data = await readFile(mdxpath, { encoding: 'utf-8' })
  // mdxをパースする。
  // remark,rehypeのプラグインを指定する場合、またfront-matterもパースする場合、ここで指定する
  const parsed = matter(data)
  return parsed
}

export default async function Page({ params }) {
  const parsed = await loadMDX(params.id)
  const { title, date } = parsed.data
  const mdText = parsed.content

  // const frontmatter = mdx.frontmatter as { title: string; author: string }
  const post = {
    title,
    date,
    mdText,
    author: '',
    tags: []
  }
  return (
    // <div>
    //   <header
    //     style={
    //       {
    //         /*略*/;
    //       }
    //     }
    //   >
    //     <h1>{frontmatter.title}</h1>
    //     <div>{frontmatter.author}</div>
    //     <div>{new Date().toLocaleString()}</div>
    //   </header>
    //   <article>{content}</article>
    // </div>
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
